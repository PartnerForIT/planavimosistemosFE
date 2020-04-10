import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Reports.module.scss';
import DRP from '../Core/DRP/DRP';
import Button from '../Core/Button/Button';
import DataTable from '../Core/DataTableCustom/DTM';
import {
  reportSelector,
  columnsSelector,
  reportLoadingSelector,
  totalDurationSelector,
} from '../../store/reports/selectors';
import { employeesSelector } from '../../store/employees/selectors';
import { specializationsSelector } from '../../store/specializations/selectors';
import { getEmployee, getEmployees } from '../../store/employees/actions';
import { getSpecializations } from '../../store/specializations/actions';
import { getPlaces } from '../../store/places/actions';
import InfoIcon from '../Icons/InfoIcon';
import ClosableCard from '../Core/ClosableCard/ClosableCard';
import ReportsIcon from '../Icons/ReportsIcon';
import CheckboxGroupWrapper from "../Core/CheckboxGroup/CheckboxGroupWrapper";
import ArrowRightIcon from "../Icons/ArrowRightIcon";
import classNames from "classnames";
import { placesSelector } from "../../store/places/selectors";
import { getReport } from "../../store/reports/actions";

const data = [
  {
    id: 0,
    start_date: '2019-09-29',
    end_date: '2019-09-30',
  },
  {
    id: 1,
    start_date: '2019-10-29',
    end_date: '2019-11-29',
  },
  {
    id: 2,
    start_date: '2020-03-15',
    end_date: '2020-03-22',
  },
  {
    id: 3,
    start_date: '2020-03-22',
    end_date: '2020-03-22',
  },
  {
    id: 4,
    start_date: '2019-03-15',
    end_date: '2020-03-15',
  },
];

const Reports = () => {
  /* Reports data */
  const [reports, setReports] = useState(data);
  const [activeReport, setActiveReport] = useState();


  /* Data table */
  const [itemsArray, setItemsArray] = useState([]);
  const [columnsArray, setColumnsArray] = useState([]);
  const [totalDuration, setTotalDuration] = useState(null);
  // const [employee, setEmployee] = useState(null);
  // const [employeeLoading, setEmployeeLoading] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(null);
  // const [page, setPage] = useState(1);

  const [dateRange, setDateRange] = useState({});

  const [specializations, setSpecializations] = useState([]);
  const [checkedSpecializations, setCheckedSpecializations] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const [places, setPlaces] = useState([]);
  const [checkedPlaces, setCheckedPlaces] = useState([]);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const generatedReport = useSelector(reportSelector);
  // const reportLoading = useSelector(reportLoadingSelector());
  const columns = useSelector(columnsSelector);
  const getTotalDuration = useSelector(totalDurationSelector);

  const getAllEmployees = useSelector(employeesSelector);
  const getAllSpecializations = useSelector(specializationsSelector);
  const getAllPlaces = useSelector(placesSelector);

  const mainContainerClasses = classNames(styles.mainContainer, {
    [styles.mainContainerWithReports]: reports.length,
  });

  useEffect(() => {
    dispatch(getSpecializations()).then().catch();
    dispatch(getEmployees()).then().catch();
    dispatch(getPlaces()).then().catch();
  }, []);

  const sendRequest = () => {
    const { startDate, endDate } = dateRange;
    dispatch(getReport(startDate, endDate)).then().catch();
  };

  useEffect(() => {
    setPlaces(getAllPlaces);
  }, [getAllPlaces]);

  useEffect(() => {
    setEmployees(getAllEmployees);
  }, [getAllEmployees]);

  useEffect(() => {
    setSpecializations(getAllSpecializations);
  }, [getAllSpecializations]);

  useEffect(() => {
    setItemsArray(generatedReport);
    setColumnsArray(columns);
    setTotalDuration(getTotalDuration);
  }, [generatedReport, columns, getTotalDuration]);

  // useEffect(() => {
  //   setLoading(reportLoading);
  // }, [reportLoading]);

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

  const rowSelectionHandler = (selectedRow) => {
    setSelectedItem(selectedRow);
  };

  const closeReportTabHandler = (e, reportId) => {
    e.stopPropagation();
    const removeReport = (reps) => reps.filter((rep) => rep.id !== reportId);
    setReports(removeReport);
    if (reportId === activeReport) setActiveReport(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <div style={{ display: 'flex', width: '100%', overflowY: 'scroll' }}>
          {
            reports.map((report) => (
              <ClosableCard
                title='Object and employee report'
                dateRange={report}
                selected={report.id === activeReport}
                onClick={setActiveReport}
                onClose={closeReportTabHandler}
              />
            ))
          }
        </div>
        <div className={mainContainerClasses}>
          {
            itemsArray.length > 0
              ? (
                <DataTable
                  data={itemsArray || []}
                  columns={columnsArray || []}
                  onColumnsChange={setColumnsArray}
                  sortable
                  loading={loading}
                  onSort={sortHandler}
                  selectedItem={selectedItem}
                  totalDuration={totalDuration}
                  setSelectedItem={rowSelectionHandler}
                  reports
                />
              )
              : (
                <div className={styles.emptyContainer}>
                  <div className={styles.emptyContent}>
                    <div>
                      <ReportsIcon className={styles.reportsIcon} />
                      <p className={styles.title}>NOTHING SELECTED</p>
                      <p className={styles.description}>Please select an object or place to genenerate report</p>
                    </div>
                    <div className={styles.arrowIcon}>
                      <ArrowRightIcon />
                    </div>
                  </div>
                </div>
              )
          }
        </div>
      </div>

      <div className={styles.rightSidebar}>
        <div className={styles.multipleEntries}>
          <div className={styles.header}>
            <InfoIcon />
            <Delimiter />
            Generate Report
          </div>
          <div className={styles.sidebarContent}>
            <div className={styles.sidebarTitle}>Report period</div>
            <DRP initRange={dateRange} onChange={setDateRange} small right />
            {
              places.length > 0 ? (
                <>
                  <div className={styles.sidebarTitle}>Objects</div>
                  <div className={styles.checkboxGroupWrapper}>
                    <CheckboxGroupWrapper items={places} onChange={setCheckedPlaces} />
                  </div>
                </>
              ) : null
            }
            {
              employees.length > 0 ? (
                <>
                  <div className={styles.sidebarTitle}>Employees</div>
                  <div className={styles.checkboxGroupWrapper}>
                    <CheckboxGroupWrapper items={employees} onChange={setCheckedEmployees} />
                  </div>
                </>
              ) : null
            }
            {
              specializations.length > 0 ? (
                <>
                  <div className={styles.sidebarTitle}>Specializations</div>
                  <div className={styles.checkboxGroupWrapper}>
                    <CheckboxGroupWrapper items={specializations} onChange={setCheckedSpecializations} />
                  </div>
                </>
              ) : null
            }
          </div>
          <div className={styles.actions}>
            <Button onClick={sendRequest} fillWidth>{t('Generate Report')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
