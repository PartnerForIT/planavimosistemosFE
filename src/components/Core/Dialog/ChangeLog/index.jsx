import React, { useState ,useCallback, useEffect} from 'react';
import Dialog from '../index';
import DataTable from '../../../Core/DataTableCustom/OLT';
//import moment from 'moment';
import style from './ChangeLog.module.scss';
//import useCompanyInfo from '../../../../hooks/useCompanyInfo';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  changesLog,
} from '../../../../store/simpleSchedule/actions';
import moment from 'moment';

const columns = [
  { label: 'Task name', field: 'title', checked: true },
  { label: 'Timestamp', field: 'created_at', checked: true },
  { label: 'Changes for', field: 'employee', checked: true },
  { label: 'Changed by', field: 'owner', checked: true },
  //{ label: 'Day', field: 'day', checked: true },
  { label: 'Time before', field: 'time_before', checked: true },
  { label: 'Time after', field: 'time_after', checked: true },
];

const columnsWidthArray = {
  title: 220,
  created_at: 120,
  employee: 140,
  owner: 140,
  //day: 80,
  time_before: 105,
  time_after: 105,
};

export default function ChangeLog({
  date,
  onClose,
  open,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // eslint-disable-next-line
  const close = () => {
    onClose();
  };

  //const { getDateFormat } = useCompanyInfo();
  // const dateFormat = getDateFormat({
  //   'YY.MM.DD': 'YYYY, MMM DD',
  //   'DD.MM.YY': 'DD MMM, YYYY',
  //   'MM.DD.YY': 'MMM DD, YYYY',
  // });

  const [columnsArray, setColumnsArray] = useState(columns);
  const [dataArray, setDataArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalDuration] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id: companyId } = useParams();
  const page = {};

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      dispatch(changesLog(
        {
          companyId,
          data: {
            date: moment(date).format('YYYY-MM-DD'),
          }
        }
      )).then((data) => {

        if (data.data) {
          setDataArray(data.data);
        }
        
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line
  }, [open, date]);

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

  const rowSelectionHandler = (selectedRow) => {
    setSelectedItem(selectedRow);
  };
  


  return (
    <Dialog
      handleClose={close}
      open={open}
      title={t('Change Log')}
    >
      <div className={style.changeLog}>
        <DataTable
          data={dataArray || []}
          columns={columnsArray || []}
          columnsWidth={columnsWidthArray || {}}
          onColumnsChange={setColumnsArray}
          sortable
          loading={isLoading}
          onSelect={selectionHandler}
          onSort={sortHandler}
          lastPage={page.last_page}
          activePage={page.current_page}
          itemsCountPerPage={page.per_page}
          totalItemsCount={page.total}
          handlePagination={console.log}
          selectedItem={selectedItem}
          totalDuration={totalDuration}
          setSelectedItem={rowSelectionHandler}
          verticalOffset='430px'
          simpleTable
        />
        
      </div>

    </Dialog>
  );
}