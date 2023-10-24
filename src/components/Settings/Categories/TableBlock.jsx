import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import DataTable from '../../Core/DataTableCustom/OLT';
import Label from '../../Core/InputLabel';
import CurrencySign from '../../shared/CurrencySign';
import DeleteItem from '../../Core/Dialog/DeleteItem';
import DialogCreateSkill from '../../Core/Dialog/CreateSkill';
import DialogCreateJob from '../../Core/Dialog/CreateJob';
import DialogCreatePlace from '../../Core/Dialog/CreatePlace';
import DialogCreateBreak from '../../Core/Dialog/CreateBreak';
import {
  patchPlace,
  deletePlace,
  patchJob,
  deleteJob,
  patchSkill,
  deleteSkill,
} from '../../../store/settings/actions';

const LabelWithCurrencySign = ({ title, tail }) => (
  <>
    {title}
    {' '}
    <CurrencySign />
    {tail}
  </>
);

const columns = [
  { label: 'Title', field: 'name', checked: true },
  { label: 'ID', field: 'id', checked: true },
  { label: <LabelWithCurrencySign title='Cost' tail='/h' />, field: 'cost', checked: true },
  { label: <LabelWithCurrencySign title='Charge' tail='/h' />, field: 'earn', checked: true },
];

const columnsJobs = [
  { label: 'Title', field: 'title', checked: true },
  { label: 'ID', field: 'id', checked: true },
  { label: 'Break Times', field: 'breaks', checked: true },
];

const columnsPlaces = [
  { label: 'Title', field: 'name', checked: true },
  { label: 'ID', field: 'id', checked: true },
  { label: 'External ID', field: 'external_id', checked: true },
];

const columnsWidthArray = {
  name: 'auto',
  external_id: 'auto',
  id: 'auto',
  cost: 'auto',
  earn: 'auto',
  breaks: 'auto',
};

const page = {};

export default function TableBlock({
  style,
  skills,
  allJobTypes,
  allPlaces,
  permissions,
  selectedCategory,
  loading,
  companyId,
  scheduleSettings,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [columnsArray, setColumnsArray] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditItem, setIsEditItem] = useState(false);
  const [isDeleteItem, setIsDeleteItem] = useState(false);
  const [isEditBreak, setIsEditBreak] = useState(false);
  
  const [dataArray, setDataArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const entityName = useMemo(() => {
    switch (selectedCategory) {
      case 'skills': {
        return 'skill';
      }
      case 'jobs': {
        return 'job';
      }
      case 'places': {
        return 'place';
      }
      default: return '';
    }
  }, [selectedCategory]);
  const selectedItemData = useMemo(() => {
    if (selectedItem) {
      switch (selectedCategory) {
        case 'skills': {
          const foundSkill = skills.find((item) => item.id === selectedItem);
          return {
            ...foundSkill,
            title: foundSkill.name,
          };
        }
        case 'jobs': {
          const foundJob = allJobTypes.find((item) => item.id === selectedItem);
          return {
            ...foundJob,
          };
        }
        case 'places': {
          const foundPlace = allPlaces.find((item) => item.id === selectedItem);
          return {
            ...foundPlace,
            title: foundPlace.name,
            external_id: foundPlace.external_id,
          };
        }
        default: return '';
      }
    }

    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  useEffect(() => {
    switch (selectedCategory) {
      case 'skills': {
        setDataArray(skills.map((item) => ({
          ...item,
          ...(item.use_rates ? {} : {
            cost: '',
            earn: '',
          }),
        })));
        break;
      }
      case 'jobs': {
        setDataArray(allJobTypes);
        break;
      }
      case 'places': {
        setDataArray(allPlaces);
        break;
      }
      default: break;
    }
  }, [selectedCategory, skills, allJobTypes, allPlaces, setDataArray]);

  useEffect(() => {
    let allColumnsArray;

    switch (selectedCategory) {
      case 'skills': {
        allColumnsArray = columns.filter((column) => {
          if (!permissions.cost && column.field === 'cost') {
            return false;
          }
          if (!permissions.profit && column.field === 'earn') {
            return false;
          }
          return true;
        });
        break;
      }
      case 'jobs': {
        allColumnsArray = columnsJobs.filter((column) => {
          if ((!scheduleSettings.deduct_break || !scheduleSettings.break_from_job) && column.field === 'breaks') {
            return false;
          }
          return true;
        });
        break;
      }
      case 'places': {
        allColumnsArray = columnsPlaces.filter((column) => {
          if (!permissions.integrations && column.field === 'external_id') {
            return false;
          }
          return true;
        });
        break;
      }
      default: break;
    }

    setColumnsArray(allColumnsArray);
  }, [permissions, selectedCategory]);

  const selectionHandler = (itemId, value) => {
    setDataArray((prevState) => prevState.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          checked: !item.checked,
        };
      }
      return item;
    }));

    if (value) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      const index = checkedItems.indexOf(itemId);
      checkedItems.splice(index, 1);
      setCheckedItems([...checkedItems]);
    }
  };

  const sortHandler = useCallback((field, asc) => {
    const sortNumFunction = (a, b) => (asc ? (a[field] - b[field]) : (b[field] - a[field]));
    const sortFunction = (a, b) => {
      if (typeof a[field] === 'number' && typeof b[field] === 'number') {
        return sortNumFunction(a, b);
      }
      if (typeof a[field] === 'object' || typeof b[field] === 'object') {
        return sortNumFunction(a, b);
      }
      if (asc) {
        return a[field].toString().localeCompare(b[field]);
      }
      return b[field].toString().localeCompare(a[field]);
    };
    const sortItems = (array) => {
      const arrayCopy = [...array];
      arrayCopy.sort(sortFunction);
      return arrayCopy;
    };
    setDataArray(sortItems);
  }, []);

  const onEditItem = (itemId) => {
    setSelectedItem(itemId);
    setIsEditItem(true);
  };
  const onDeleteItem = (itemId) => {
    setSelectedItem(itemId);
    setIsDeleteItem(true);
  };
  const handleCloseItem = () => {
    setSelectedItem(null);
    setIsDeleteItem(false);
    setIsEditItem(false);
  };
  const handleConfirmRemoveItem = () => {
    switch (selectedCategory) {
      case 'skills': {
        dispatch(deleteSkill(companyId, selectedItem));
        break;
      }
      case 'jobs': {
        dispatch(deleteJob(companyId, selectedItem));
        break;
      }
      case 'places': {
        dispatch(deletePlace(companyId, selectedItem));
        break;
      }
      default: break;
    }
  };
  const updateJob = (name) => {
    dispatch(patchJob({ title: name }, companyId, selectedItem));
    handleCloseItem();
  };
  const updateSkill = (values) => {
    dispatch(patchSkill({
      ...values,
      use_rates: Number(values.use_rates),
    }, companyId, selectedItem));
    handleCloseItem();
  };
  const updatePlace = ({name, external_id}) => {
    dispatch(patchPlace({ name, external_id }, companyId, selectedItem));
    handleCloseItem();
  };
  const onEditBreak = (id) => {
    setSelectedItem(id);
    setIsEditBreak(id);
  };
  const handleCloseBreak = () => {
    setSelectedItem(null);
    setIsEditBreak(false);
  }
  const onCreateBreak = (values) => {
    dispatch(patchJob({ breaks: values }, companyId, selectedItem));
    handleCloseBreak();
  }

  return (
    <div className={style.categoryPage__Table}>
      <Label text={t('Select Category')} htmlFor='' />
      <DataTable
        data={dataArray || []}
        columns={columnsArray || []}
        columnsWidth={columnsWidthArray || {}}
        onColumnsChange={setColumnsArray}
        sortable
        onSelect={selectionHandler}
        onSort={sortHandler}
        lastPage={page.last_page}
        activePage={page.current_page}
        itemsCountPerPage={page.per_page}
        totalItemsCount={page.total}
        handlePagination={console.log}
        selectedItem={selectedRow}
        setSelectedItem={setSelectedRow}
        verticalOffset='360px'
        simpleTable
        withoutFilterColumns
        hoverActions
        loading={loading}
        editRow={onEditItem}
        removeRow={onDeleteItem}
        onEditBreak={onEditBreak}
        grey
      />
      <DeleteItem
        open={isDeleteItem}
        handleClose={handleCloseItem}
        title={`Delete ${entityName}`}
        description={selectedItemData?.title}
        onConfirmRemove={handleConfirmRemoveItem}
      />
      <DialogCreateSkill
        open={isEditItem && selectedCategory === 'skills'}
        handleClose={handleCloseItem}
        title={t('Update skill')}
        buttonTitle={t('Update skill')}
        initialValues={selectedItemData}
        createSkill={updateSkill}
        permissions={permissions}
      />
      <DialogCreateJob
        open={isEditItem && selectedCategory === 'jobs'}
        handleClose={handleCloseItem}
        title={t('Update Job name')}
        buttonTitle={t('Update Job Name')}
        initialValue={selectedItemData?.title}
        createJob={updateJob}
      />
      <DialogCreatePlace
        open={isEditItem && selectedCategory === 'places'}
        handleClose={handleCloseItem}
        title={t('Update Place name')}
        buttonTitle={t('Update Place Name')}
        initialValues={selectedItemData}
        createPlace={updatePlace}
        permissions={permissions}
      />
      <DialogCreateBreak
        open={!!isEditBreak}
        handleClose={handleCloseBreak}
        title={t('Break Time')}
        buttonTitle={t('Change Time')}
        initialValues={selectedItemData.breaks}
        createBreak={onCreateBreak}
      />
    </div>
  );
}
