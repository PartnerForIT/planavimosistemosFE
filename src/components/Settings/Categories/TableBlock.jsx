import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import DataTable from '../../Core/DataTableCustom/OLT';
import Label from '../../Core/InputLabel';
import DeleteItem from '../../Core/Dialog/DeleteItem';
import DialogCreateSkill from '../../Core/Dialog/CreateSkill';
import DialogCreateJob from '../../Core/Dialog/CreateJob';
import DialogCreatePlace from '../../Core/Dialog/CreatePlace';
import DialogCreateBreak from '../../Core/Dialog/CreateBreak';
import DialogCreateAddress from '../../Core/Dialog/CreateAddress';
import DialogAssignGroup from '../../Core/Dialog/AssignGroup';
import DialogWorkTime from '../../Core/Dialog/WorkTime';
import DialogCreateCustomCategory from '../../Core/Dialog/CreateCustomCategory';
import LabelWithCurrencySign from '../../shared/LabelWithCurrencySign';
import {
  patchPlace,
  deletePlace,
  patchJob,
  deleteJob,
  patchSkill,
  deleteSkill,
  patchCustomCategory,
  deleteCustomCategory,
} from '../../../store/settings/actions';

const columns = [
  { label: 'Title', field: 'name', checked: true },
  //{ label: 'ID', field: 'id', checked: true },
  { label: <LabelWithCurrencySign text='Cost' tail='/h' />, field: 'cost', checked: true },
  { label: <LabelWithCurrencySign text='Charge' tail='/h' />, field: 'earn', checked: true },
];

const columnsJobs = [
  { label: 'Title', field: 'title', checked: true },
  //{ label: 'ID', field: 'id', checked: true },
  { label: 'Break Times', field: 'breaks', checked: true },
];

const columnsPlaces = [
  { label: 'Title', field: 'name', checked: true },
  //{ label: 'ID', field: 'id', checked: true },
  { label: 'Work Time', field: 'work_time', checked: true },
  { label: 'Assigned to Group/Subgroup', field: 'place_groups', checked: true },
  { label: 'Geolocation', field: 'place_address', checked: true },
  { label: 'External ID', field: 'external_id', checked: true },
];

const columnsCustomCategories = [
  { label: 'Title', field: 'name', checked: true },
  { label: 'Entry field?', field: 'entry_field', checked: true },
];

const columnsWidthArray = {
  name: 'auto',
  external_id: 'auto',
  id: 'auto',
  cost: 'auto',
  earn: 'auto',
  breaks: 'auto',
  groups: 'auto',
};

const page = {};

export default function TableBlock({
  style,
  skills,
  allJobTypes,
  allPlaces,
  allCustomCategories,
  permissions,
  selectedCategory,
  loading,
  companyId,
  scheduleSettings,
  groups
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [columnsArray, setColumnsArray] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditItem, setIsEditItem] = useState(false);
  const [isDeleteItem, setIsDeleteItem] = useState(false);
  const [isEditBreak, setIsEditBreak] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [isAssignGroup, setIsAssignGroup] = useState(false);
  const [isEditWorkTime, setIsEditWorkTime] = useState(false);
  const [colSearch, setColSearch] = useState({});
  
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
      case 'custom_category': {
        return 'additional category';
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
        case 'custom_category': {
          const foundCustomCategory = allCustomCategories.find((item) => item.id === selectedItem);
          return {
            ...foundCustomCategory,
            title: foundCustomCategory.name,
            entry_field: foundCustomCategory.entry_field,
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
        setDataArray(
          allPlaces.filter(empl => {
            let globalSearch = true;
            for (let key in colSearch) {
              if (colSearch[key]) {
                let emplValue = empl[key];
                let searchValue = colSearch[key].toLowerCase();
                
                if ((emplValue !== undefined && emplValue !== null) || key === 'place_groups' || key === 'work_time' || key === 'place_address') {
                  if (key === 'place_groups') {
                    emplValue = '';
                    for (let group of empl.groups) {
                      if (group.name.toLowerCase().indexOf(searchValue) !== -1) {
                        emplValue += group.name.toLowerCase()+'; '; 
                      }
                    }
                  } else if (key === 'work_time') {
                    emplValue = '';
                    if (empl.work_time) {
                      emplValue = Object.keys(empl.work_time)
                        .sort((a, b) => ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(a) - ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(b))
                        .filter((day) => empl.work_time[day].checked) // Filter out days where checked is false
                        .map((day) => {
                          return `${day} - (${empl.work_time[day].start} - ${empl.work_time[day].finish})`;
                        })
                        .join("/ ");
                    }
                  } else if (key === 'place_address') {
                    emplValue = empl.address || '';
                    emplValue = emplValue.toString().toLowerCase();
                  } else {
                    // Convert emplValue to string for other fields
                    emplValue = emplValue.toString().toLowerCase();
                  }
          
                  if (emplValue.indexOf(searchValue) === -1) {
                    return false; // This employee does not match the search term
                  }
                } else {
                  return false; // Missing value for a key that has a search term
                }
              }
            }
            
            return globalSearch;
          })
        );
        break;
      }
      case 'custom_category': {
        setDataArray(allCustomCategories.map((item) => ({
          ...item,
          entry_field: item.entry_field ? t('Yes') : t('No'),
        })));
        break;
      }
      default: break;
    }
    // eslint-disable-next-line
  }, [selectedCategory, skills, allJobTypes, allPlaces, allCustomCategories, setDataArray, colSearch]);

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
          if ((!permissions.create_groups || !groups?.length) && column.field === 'place_groups') {
            return false;
          }
          return true;
        });
        break;
      }
      case 'custom_category': {
        allColumnsArray = columnsCustomCategories;
        break;
      }
      default: break;
    }

    setColumnsArray(allColumnsArray);
    // eslint-disable-next-line
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

  const onColumnSearch = (column, value) => {
    setColSearch({ ...colSearch, [column]: value });
  }

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
      case 'custom_category': {
        dispatch(deleteCustomCategory(companyId, selectedItem));
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
  const updateCustomCategory = (values) => {
    dispatch(patchCustomCategory(values, companyId, selectedItem));
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

  const onEditAddress = (id) => {
    setSelectedItem(id);
    setIsEditAddress(id);
  }
  const handleCloseAddress = () => {
    setSelectedItem(null);
    setIsEditAddress(false);
  }
  const onCreateAddress = (values) => {
    let post = {address: '', coordinates: '', radius: '', disable_rtt: values.disable_rtt};
    if (values.address) post = { ...post, address: values.address };
    if (values.coordinates) post = { ...post, coordinates: values.coordinates };
    if (values.radius) post = { ...post, radius: values.radius };

    dispatch(patchPlace({ ...post  }, companyId, selectedItem));
    setIsEditAddress();
  }

  const onOpenAssignGroup = (id) => {
    setSelectedItem(id);
    setIsAssignGroup(id);
  };
  const handleCloseAssignGroup = () => {
    setSelectedItem(null);
    setIsAssignGroup(false);
  }
  const onAssignGroup = (values) => {
    dispatch(patchPlace({ groups: values?.groups || [] }, companyId, selectedItem));
    handleCloseAssignGroup();
  }

  const onOpenWorkTime = (id) => {
    setSelectedItem(id);
    setIsEditWorkTime(id);
  };

  const handleCloseWorkTime = () => {
    setSelectedItem(null);
    setIsEditWorkTime(false);
  }
  const onEditWorkTime = (values) => {
    dispatch(patchPlace({ work_time: values || [] }, companyId, selectedItem));
    setIsEditWorkTime();
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
        hoverActions
        hoverable
        loading={loading}
        editRow={onEditItem}
        removeRow={onDeleteItem}
        onEditBreak={onEditBreak}
        onEditAddress={onEditAddress}
        onOpenAssignGroup={onOpenAssignGroup}
        onOpenWorkTime={onOpenWorkTime}
        grey
        colSearch={selectedCategory === 'places' ? colSearch : null}
        onSearch={selectedCategory === 'places' ? onColumnSearch : null}
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
      <DialogCreateCustomCategory
        open={isEditItem && selectedCategory === 'custom_category'}
        handleClose={handleCloseItem}
        title={t('Update additional category')}
        buttonTitle={t('Update Additional Category')}
        initialValues={selectedItemData}
        createCategory={updateCustomCategory}
      />
      <DialogCreateBreak
        open={!!isEditBreak}
        handleClose={handleCloseBreak}
        title={t('Break Time')}
        buttonTitle={t('Change Time')}
        initialValues={selectedItemData.breaks}
        createBreak={onCreateBreak}
      />
      <DialogAssignGroup
        open={!!isAssignGroup}
        handleClose={handleCloseAssignGroup}
        title={t('Assign to Group/Subgroup')}
        buttonTitle={t('Assign')}
        initialValues={selectedItemData}
        groups={groups}
        assignGroup={onAssignGroup}
      />
      <DialogWorkTime
        open={!!isEditWorkTime}
        handleClose={handleCloseWorkTime}
        title={t('setWorkTimeFor', { title: selectedItemData?.title })}
        buttonTitle={t('Save Place Work Time')}
        initialValues={selectedItemData}
        editWorkTime={onEditWorkTime}
      />
      <DialogCreateAddress
        open={!!isEditAddress}
        handleClose={handleCloseAddress}
        title={t('Assign Geolocation')}
        buttonTitle={t('Assign Geolocation')}
        initialValues={selectedItemData}
        createAddress={onCreateAddress}
      />
    </div>
  );
}
