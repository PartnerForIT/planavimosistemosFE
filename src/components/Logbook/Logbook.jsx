import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import styles from './Logbook.module.scss';
import DRP from '../Core/DRP/DRP';
import SearchIcon from '../Icons/SearchIcon';
import Input from '../Core/Input/Input';
import CustomSelect from '../Core/Select/Select';
import Button from '../Core/Button/Button';
import DataTable from '../Core/DataTableCustom/DTM';
import TableIcon from '../Icons/TableIcon';
import { workTimeSelector, columnsSelector } from '../../store/worktime/selectors';
import { employeeSelector, employeeLoadingSelector } from '../../store/employees/selectors';
import { getWorkTime } from '../../store/worktime/actions';
import { getEmployee } from '../../store/employees/actions';
import avatar from '../Icons/avatar.png';
import Timeline from '../Core/Timeline/Timeline';
import { datetimeToMinutes } from '../Helpers';
import InfoCard from '../Core/InfoCard/InfoCard';

const selectItems = [
  {
    id: 0,
    type: 'group',
    label: 'Group A',
    items: [
      {
        id: 1,
        label: 'Employee Name',
        checked: false,
      },
      {
        id: 2,
        label: 'Employee Name 2',
        checked: true,
      },
    ],
  },
  {
    id: 3,
    type: 'group',
    label: 'Group B',
    checked: true,
    items: [
      {
        id: 4,
        label: 'Employee Name 3',
        checked: false,
      },
      {
        id: 5,
        label: 'Employee Name 4',
        checked: true,
      },
      {
        id: 6,
        label: 'Employee Name 5',
        checked: true,
        disabled: true,
      },
    ],
  },
  {
    id: 7,
    type: 'group',
    label: 'Group C',
    checked: false,
    items: [
      {
        id: 8,
        type: 'group',
        label: 'Group C.1',
        checked: false,
        items: [
          {
            id: 9,
            label: 'Employee Name',
            checked: false,
          },
          {
            id: 10,
            label: 'Employee Name 2',
            checked: true,
          },
          {
            id: 11,
            label: 'Employee Name 3',
            checked: false,
            disabled: true,
          },
        ],
      },
      {
        id: 12,
        type: 'group',
        label: 'Group C.2',
        checked: false,
        items: [
          {
            id: 13,
            label: 'Employee Name C.2',
            checked: false,
          },
          {
            id: 14,
            label: 'Employee Name 2  C.2',
            checked: true,
          },
          {
            id: 15,
            label: 'Employee Name 3  C.2',
            checked: true,
            disabled: true,
          },
          {
            id: 16,
            label: 'Employee Name 4  C.2',
            checked: false,
            disabled: true,
          },
        ],
      },
    ],
  },
];

const Logbook = () => {
  const [itemsArray, setItemsArray] = useState([]);
  const [columnsArray, setColumnsArray] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [employeeLoading, setEmployeeLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const workTime = useSelector(workTimeSelector);
  const columns = useSelector(columnsSelector);
  const selectedEmployee = useSelector(employeeSelector);
  const selectedEmployeeLoading = useSelector(employeeLoadingSelector);

  useEffect(() => {
    const { startDate, endDate } = dateRange;
    dispatch(getWorkTime({
      page,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : '',
      endDate: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : '',
    })).then().catch();
  }, [page]);

  useEffect(() => {
    const { startDate, endDate } = dateRange;
    dispatch(getWorkTime({
      page: 1,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : '',
      endDate: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : '',
    })).then().catch();
  }, [dateRange]);

  useEffect(() => {
    setEmployee(selectedEmployee);
    setEmployeeLoading(selectedEmployeeLoading);
  }, [selectedEmployee, selectedEmployeeLoading]);

  useEffect(() => {
    setItemsArray(workTime.data);
    setColumnsArray(columns);
  }, [workTime.data, columns]);

  const selectionHandler = useCallback((itemId, value) => {
    const setCheckedToAll = (state) => {
      const arrayCopy = [...state];
      return arrayCopy.map((group) => {
        const items = group.items.map((row) => {
          const newRowObj = { ...row };
          if (typeof itemId === 'string' && itemId === 'all') {
            newRowObj.checked = value;
          } else if (Array.isArray(itemId) && itemId.includes(newRowObj.id)) {
            newRowObj.checked = value;
          } else if (newRowObj.id === itemId) {
            newRowObj.checked = value;
          }
          return newRowObj;
        });
        return { ...group, items };
      });
    };
    setItemsArray(setCheckedToAll);
  }, []);

  const sortHandler = useCallback((field, asc) => {
    const sortNumFunction = (a, b) => (asc ? (a[field] - b[field]) : (b[field] - a[field]));
    const sortFunction = (a, b) => {
      if (typeof a[field] === 'number' && typeof b[field] === 'number') {
        return sortNumFunction(a, b);
      }
      if (asc) {
        return a[field].toString().localeCompare(b[field]);
      }
      return b[field].toString().localeCompare(a[field]);
    };
    const sortItems = (array) => {
      const arrayCopy = [...array];
      return arrayCopy.map((group) => {
        const items = [...group.items];
        items.sort(sortFunction);
        return { ...group, items };
      });
    };
    setItemsArray(sortItems);
  }, []);

  const Delimiter = () => (<div className={styles.delimiter} />);

  const applyHandler = (e) => {
    console.log('applyHandler', e);
  };

  const rowSelectionHandler = (selectedRow) => {
    setSelectedItem(selectedRow);
    dispatch(getEmployee(selectedRow.id)).then().catch();
  };
  console.log('employee', employee);
  console.log('selectedItem', selectedItem);
  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <header className={styles.appHeader}>
          <DRP initRange={dateRange} onChange={setDateRange} />
          <Delimiter />
          <Input icon={<SearchIcon />} placeholder={`${t('Search')}...`} width='186px' height='36px' />
          <Delimiter />
          <CustomSelect placeholder={t('All groups')} buttonLabel={t('Filter')} items={selectItems} />
          <Delimiter />
          <CustomSelect placeholder={t('All employees')} buttonLabel={t('Filter')} items={selectItems} />
          <Delimiter />
          <Button onClick={applyHandler}>{t('Apply')}</Button>
        </header>
        <Delimiter />
        <DataTable
          data={itemsArray || []}
          columns={columnsArray || []}
          onColumnsChange={setColumnsArray}
          selectable
          sortable
          onSelect={selectionHandler}
          onSort={sortHandler}
          lastPage={workTime.last_page}
          activePage={workTime.current_page}
          itemsCountPerPage={workTime.per_page}
          totalItemsCount={workTime.total}
          handlePagination={setPage}
          selectedItem={selectedItem}
          setSelectedItem={rowSelectionHandler}
        />
      </div>

      <div className={styles.rightSidebar}>
        {
          employee
            ? (
              <div className={styles.employeeInfo}>
                <div className={styles.hero}>
                  <img src={avatar} alt={`${employee.name} ${employee.surname}`} width='71' height='72' />
                  <div className={styles.employeeName}>{`${employee.name} ${employee.surname}`}</div>
                  <div className={styles.date}>
                    {
                      format(new Date(employee.works[0].started_at), 'iii, dd, MMMM, yyyy')
                    }
                  </div>
                  <Delimiter />
                  {
                    selectedItem && selectedItem.employee_id === employee.id && !employeeLoading && (
                      <>
                        <Timeline
                          data={employee.works}
                          total={selectedItem.total_duration}
                          startMinute={datetimeToMinutes(selectedItem.started_at)}
                          withTimeBreaks
                        />
                        <Delimiter />
                        <InfoCard
                          type='total'
                          time={selectedItem}
                          onChange={console.log}
                          editable
                        />
                      </>
                    )
                  }
                </div>
              </div>
            )
            : (
              <div className={styles.emptyWrapper}>
                <TableIcon />
                <p>Select any entry to get a detailed editable info</p>
              </div>
            )
        }
      </div>
    </div>
  );
};

export default Logbook;
