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
import {
  workTimeSelector,
  columnsSelector,
  columnsWidthSelector,
  totalDurationSelector,
  workTimeLoadingSelector,
} from '../../store/worktime/selectors';
import { employeeSelector, employeesSelector, employeeLoadingSelector } from '../../store/employees/selectors';
import { specializationsSelector } from '../../store/specializations/selectors';
import { getWorkTime, removeItems } from '../../store/worktime/actions';
import { getEmployee, getEmployees } from '../../store/employees/actions';
import { getSpecializations } from '../../store/specializations/actions';
import avatar from '../Icons/avatar.png';
import Timeline from '../Core/Timeline/Timeline';
import { dateToUCT, minutesToString } from '../Helpers';
import InfoCard from '../Core/InfoCard/InfoCard';
import InfoIcon from '../Icons/InfoIcon';
import CheckboxIcon from '../Icons/CheckboxIcon';
import PendingIcon from '../Icons/PendingIcon';

const Logbook = () => {
  /* Data table */
  const [itemsArray, setItemsArray] = useState([]);
  const [columnsArray, setColumnsArray] = useState([]);
  const [columnsWidthArray, setColumnsWidthArray] = useState({});
  const [totalDuration, setTotalDuration] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [employeeLoading, setEmployeeLoading] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(null);
  // const [page, setPage] = useState(1);

  const [dateRange, setDateRange] = useState({});

  const [search, setSearch] = useState('');

  const [specializations, setSpecializations] = useState([]);
  const [checkedSpecializations, setCheckedSpecializations] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const workTime = useSelector(workTimeSelector);
  const workTimeLoading = useSelector(workTimeLoadingSelector);
  const columns = useSelector(columnsSelector);
  const columnsWidth = useSelector(columnsWidthSelector);
  const selectedEmployee = useSelector(employeeSelector);
  const getAllEmployees = useSelector(employeesSelector);
  const selectedEmployeeLoading = useSelector(employeeLoadingSelector);
  const getTotalDuration = useSelector(totalDurationSelector);
  const selectSpecializations = useSelector(specializationsSelector);

  useEffect(() => {
    dispatch(getSpecializations()).then().catch();
    dispatch(getEmployees()).then().catch();
  }, [dispatch]);

  const sendRequest = (props) => {
    const { startDate, endDate } = dateRange;
    dispatch(getWorkTime({
      startDate: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : '',
      endDate: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : '',
      search,
      specs: checkedSpecializations.map((item) => item.id),
      employees: checkedEmployees.map((item) => item.id),
      ...props,
    })).then(() => {
      setCheckedItems([]);
      setEmployee(null);
      setSelectedItem(null);
    }).catch();
  };

  useEffect(() => {
    sendRequest();
  }, [dateRange]);

  useEffect(() => {
    setEmployee(selectedEmployee);
    setEmployeeLoading(selectedEmployeeLoading);
  }, [selectedEmployee, selectedEmployeeLoading]);

  useEffect(() => {
    setItemsArray(workTime);
    setColumnsArray(columns);
    setColumnsWidthArray(columnsWidth);
    setTotalDuration(getTotalDuration);
  }, [workTime, columns, columnsWidth, getTotalDuration]);

  useEffect(() => {
    setLoading(workTimeLoading);
  }, [workTimeLoading]);

  useEffect(() => {
    setSpecializations(selectSpecializations);
  }, [selectSpecializations]);

  useEffect(() => {
    setEmployees(getAllEmployees);
  }, [getAllEmployees]);

  const selectionHandler = useCallback((itemId, value) => {
    const checkedItms = [];
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
          if (newRowObj.checked) checkedItms.push(newRowObj);
          return newRowObj;
        });
        return { ...group, items };
      });
    };
    setItemsArray(setCheckedToAll);
    setCheckedItems(checkedItms);
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

  const applyHandler = () => {
    sendRequest();
  };

  const rowSelectionHandler = (selectedRow) => {
    setSelectedItem(selectedRow);
    dispatch(getEmployee(selectedRow.id)).then().catch();
  };

  const onSpecSelectChange = (specs, checkedSpecs) => {
    setCheckedSpecializations(checkedSpecs);
    sendRequest({ specs: checkedSpecs.map((item) => item.id) });
  };

  const onEmployeesSelectChange = (employeesArr, selectedEmployees) => {
    setCheckedEmployees(selectedEmployees);
    sendRequest({ employees: selectedEmployees.map((item) => item.id) });
  };

  const searchHandler = (term) => {
    setSearch(term);
    sendRequest({ search: term });
  };

  const deleteItems = () => {
    dispatch(removeItems({ items: checkedItems.map((item) => (item.id)) })).then(() => {
      sendRequest();
    }).catch();
  };

  const EmployeeInfo = () => (
    <div className={styles.employeeInfo}>
      <div className={styles.hero}>
        <img src={avatar} alt={`${employee.name} ${employee.surname}`} width='71' height='72' />
        <div className={styles.employeeName}>{`${employee.name} ${employee.surname}`}</div>
        <div className={styles.date}>
          {
            format(
              new Date(
                dateToUCT(employee.works[0].started_at).getTime()
                + dateToUCT(employee.works[0].started_at)
                  .getTimezoneOffset() * 60 * 1000,
              ), 'iii, dd, MMMM, yyyy',
            )
          }
        </div>
        <Delimiter />
        {
          selectedItem && parseInt(selectedItem.employee_id, 10) === employee.id && !employeeLoading && (
            <>
              <Timeline
                works={employee.works}
                breaks={employee.breaks}
                total={employee.total_work_sec + employee.total_break_sec}
                startMinute={selectedItem.started_at}
                withTimeBreaks
              />
              <Delimiter />
              <InfoCard
                type='total'
                time={selectedItem}
                showRange
              />
              <Delimiter />
              <InfoCard
                type='break'
                time={selectedItem}
                durationSec={employee.total_break_sec}
              />
            </>
          )
        }
      </div>
    </div>
  );

  const MultipleEntries = () => (
    <div className={styles.multipleEntries}>
      <div className={styles.header}>
        <InfoIcon />
        <Delimiter />
        Multiple entries selection
      </div>
      <div className={styles.content}>
        <div className={styles.topBlock}>
          <CheckboxIcon className={styles.checkboxIcon} />
          <div className={styles.entryTitle}>
            {`${checkedItems.length} `}
            { checkedItems.length === 1 ? 'entry' : 'entries' }
          </div>
          <div className={styles.entryDescription}>
            selected
          </div>
        </div>
        <div className={styles.bottomBlock}>
          <PendingIcon className={styles.clockIcon} />
          <div className={styles.entryTitle}>
            {minutesToString(checkedItems.map((item) => item.net_duration).reduce((a, b) => a + b))}
          </div>
          <div className={styles.entryDescription}>
            Total Hours
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <Button onClick={() => deleteItems()} danger fillWidth>
          { checkedItems.length === 1 ? t('Delete') : t('Delete All') }
        </Button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <header className={styles.appHeader}>
          <DRP initRange={dateRange} onChange={setDateRange} />
          <div className={styles.hideOn660}>
            <Delimiter />
            <Input
              icon={<SearchIcon />}
              placeholder={`${t('Search')}...`}
              width='auto'
              height='36px'
              value={search}
              onChange={(e) => searchHandler(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyHandler()}
            />
          </div>
          <div className={styles.hideOn750}>
            <Delimiter />
            <CustomSelect
              placeholder={t('All Specializations')}
              buttonLabel={t('Filter')}
              items={specializations}
              onChange={onSpecSelectChange}
              width='auto'
            />
          </div>
          <div className={styles.hideOn815}>
            <Delimiter />
            <CustomSelect
              placeholder={t('All employees')}
              buttonLabel={t('Filter')}
              items={employees}
              onChange={onEmployeesSelectChange}
              width='auto'
            />
          </div>
          <div className={styles.hideOn936}>
            <Delimiter />
            <Button onClick={applyHandler}>{t('Apply')}</Button>
          </div>
        </header>
        <Delimiter />
        <DataTable
          data={itemsArray || []}
          columns={columnsArray || []}
          columnsWidth={columnsWidthArray || {}}
          onColumnsChange={setColumnsArray}
          selectable
          sortable
          loading={loading}
          onSelect={selectionHandler}
          onSort={sortHandler}
          lastPage={workTime.last_page}
          activePage={workTime.current_page}
          itemsCountPerPage={workTime.per_page}
          totalItemsCount={workTime.total}
          handlePagination={console.log}
          selectedItem={selectedItem}
          totalDuration={totalDuration}
          setSelectedItem={rowSelectionHandler}
          verticalOffset='123px'
        />
      </div>

      <div className={styles.rightSidebar}>
        {
          // eslint-disable-next-line no-nested-ternary
          checkedItems.length > 0
            ? (
              <MultipleEntries />
            )
            : employee
              ? (
                <EmployeeInfo />
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
