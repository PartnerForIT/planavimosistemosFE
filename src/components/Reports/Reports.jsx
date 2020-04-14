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
  reportsSelector,
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
import { getReport, downloadExcel, downloadPdf } from "../../store/reports/actions";
import { endOfMonth, format, startOfMonth } from "date-fns";

const Reports = () => {
  /* Reports data */
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

  const [dateRange, setDateRange] = useState({ startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) });

  const [specializations, setSpecializations] = useState([]);
  const [checkedSpecializations, setCheckedSpecializations] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const [places, setPlaces] = useState([]);
  const [checkedPlaces, setCheckedPlaces] = useState([]);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const generatedReport = useSelector(reportSelector);
  const reportLoading = useSelector(reportLoadingSelector);
  const columns = useSelector(columnsSelector);
  const getTotalDuration = useSelector(totalDurationSelector);

  const getAllEmployees = useSelector(employeesSelector);
  const getAllSpecializations = useSelector(specializationsSelector);
  const getAllPlaces = useSelector(placesSelector);

  const mainContainerClasses = classNames(styles.mainContainer, {
    [styles.mainContainerWithReports]: itemsArray.length,
  });

  useEffect(() => {
    dispatch(getSpecializations()).then().catch();
    dispatch(getEmployees()).then().catch();
    dispatch(getPlaces()).then().catch();
  }, []);

  const sendRequest = () => {
    const { startDate, endDate } = dateRange;
    const placesArr = checkedPlaces.map((place) => place.id);
    const specsArr = checkedSpecializations.map((spec) => spec.id);
    const employeesArr = checkedEmployees.map((emp) => emp.id);
    dispatch(getReport(startDate, endDate, specsArr, employeesArr, placesArr)).then().catch();
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
    if (generatedReport.report) {
      setItemsArray((state) => (
        [...state, generatedReport]
      ));
      setActiveReport(generatedReport.id);
    }
    setColumnsArray(columns);
    setTotalDuration(getTotalDuration);
  }, [generatedReport, columns, getTotalDuration]);

  useEffect(() => {
    setLoading(reportLoading);
  }, [reportLoading]);

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
      return arrayCopy.map((report) => {

        if (report.id === activeReport) {
          const newReport = { ...report };
          const tableData = newReport.report.map((group) => {
            const items = [...group.items];
            items.sort(sortFunction);
            return { ...group, items };
          });
          return { ...newReport, data: tableData };
        }
        return report;
      });
    };

    setItemsArray(sortItems);
  }, [activeReport]);


  const Delimiter = () => (<div className={styles.delimiter} />);

  const rowSelectionHandler = (selectedRow) => {
    setSelectedItem(selectedRow);
  };

  const closeReportTabHandler = (e, reportId) => {
    e.stopPropagation();
    const removeReport = (reps) => reps.filter((rep) => rep.id !== reportId);
    setItemsArray(removeReport);
    if (reportId === activeReport) setActiveReport(null);
  };
  
  const downloadReport = (action, ext) => {
    const selectedReport = itemsArray.find((report) => report.id === activeReport);
    if (selectedReport) {
      const requestObj = {
        'date-start': selectedReport.startDate,
        'date-end': selectedReport.endDate,
        objects: selectedReport.places.length > 0 ? `[${selectedReport.places.join(',')}]` : '[]',
        specialities: selectedReport.specializations.length > 0 ? `[${selectedReport.specializations.join(',')}]` : '',
        employees: selectedReport.employees.length > 0 ? `[${selectedReport.employees.join(',')}]` : '',
      };

      dispatch(action(requestObj)).then((data) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `Report_${format(new Date(selectedReport.startDate), 'yyyy-MM-dd')}_${format(new Date(selectedReport.endDate), 'yyyy-MM-dd')}.${ext}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }).catch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <div style={{ display: 'flex', width: '100%', overflowY: 'scroll' }}>
          {
            itemsArray.length > 0 && itemsArray.map((report) => (
              <ClosableCard
                key={report.id.toString()}
                title={report.title}
                description={report.description}
                reportId={report.id}
                selected={report.id === activeReport}
                onClick={setActiveReport}
                onClose={closeReportTabHandler}
              />
            ))
          }
        </div>
        <div className={mainContainerClasses}>
          {
            itemsArray.length > 0 && activeReport
              ? itemsArray.map((report) => report.id === activeReport && (
                <DataTable
                  key={report.id.toString()}
                  data={report.report || []}
                  columns={columnsArray || []}
                  onColumnsChange={setColumnsArray}
                  sortable
                  loading={loading}
                  onSort={sortHandler}
                  selectedItem={selectedItem}
                  totalDuration={report.totalDuration}
                  setSelectedItem={rowSelectionHandler}
                  reports
                  downloadExcel={() => downloadReport(downloadExcel, 'xls')}
                  downloadPdf={() => downloadReport(downloadPdf, 'pdf')}
                />
              ))
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
