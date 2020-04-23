import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import styles from './Reports.module.scss';
import DRP from '../Core/DRP/DRP';
import Button from '../Core/Button/Button';
import DataTable from '../Core/DataTableCustom/DTM';
import {
  reportSelector,
  columnsSelector,
  reportLoadingSelector,
} from '../../store/reports/selectors';

import { employeesSelector } from '../../store/employees/selectors';
import { specializationsSelector } from '../../store/specializations/selectors';
import { getReportsEmployees } from '../../store/employees/actions';
import { getReportsSpecializations } from '../../store/specializations/actions';
import { getReportsPlaces } from '../../store/places/actions';
import { placesSelector } from '../../store/places/selectors';

import InfoIcon from '../Icons/InfoIcon';
import ClosableCard from '../Core/ClosableCard/ClosableCard';
import ReportsIcon from '../Icons/ReportsIcon';
import CheckboxGroupWrapper from '../Core/CheckboxGroup/CheckboxGroupWrapper';
import ArrowRightIcon from '../Icons/ArrowRightIcon';
import {
  getReport, downloadExcel, downloadPdf,
} from '../../store/reports/actions';
import SearchIcon from '../Icons/SearchIcon';
import Input from '../Core/Input/Input';
import { dateToUCT } from '../Helpers';

const Reports = () => {
  /* Reports data */
  const reportTabs = useRef(null);
  const [activeReport, setActiveReport] = useState();

  /* Data table */
  const [itemsArray, setItemsArray] = useState([]);
  const [columnsArray, setColumnsArray] = useState([]);
  // const [totalDuration, setTotalDuration] = useState(null);
  // const [employee, setEmployee] = useState(null);
  // const [employeeLoading, setEmployeeLoading] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  // const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(null);
  // const [page, setPage] = useState(1);

  const [dateRange, setDateRange] = useState({ startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) });

  const [specializations, setSpecializations] = useState([]);
  const [filteredSpecializations, setFilteredSpecializations] = useState([]);
  const [checkedSpecializations, setCheckedSpecializations] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [checkedPlaces, setCheckedPlaces] = useState([]);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const generatedReport = useSelector(reportSelector);
  const reportLoading = useSelector(reportLoadingSelector);
  const columns = useSelector(columnsSelector);
  // const getTotalDuration = useSelector(totalDurationSelector);

  const getAllEmployees = useSelector(employeesSelector);
  const getAllSpecializations = useSelector(specializationsSelector);
  const getAllPlaces = useSelector(placesSelector);

  const mainContainerClasses = classNames(styles.mainContainer, {
    [styles.mainContainerWithReports]: itemsArray.length,
  });

  useEffect(() => {
    dispatch(getReportsPlaces({})).then().catch();
    dispatch(getReportsEmployees({})).then().catch();
    dispatch(getReportsSpecializations({})).then().catch();
  }, []);

  useEffect(() => {
    reportTabs.current.scrollLeft = itemsArray.length * 246;
  }, [itemsArray]);

  const sendRequest = () => {
    const { startDate, endDate } = dateRange;
    const placesArr = checkedPlaces.map((place) => place.id);
    const specsArr = checkedSpecializations.map((spec) => spec.id);
    const employeesArr = checkedEmployees.map((emp) => emp.id);
    dispatch(getReport(
      format(startDate, 'yyyy-MM-dd HH:mm:ss'),
      format(endDate, 'yyyy-MM-dd HH:mm:ss'),
      specsArr,
      employeesArr,
      placesArr,
    )).then().catch();
  };

  useEffect(() => {
    setPlaces(getAllPlaces);
    setFilteredPlaces(getAllPlaces);
  }, [getAllPlaces]);

  useEffect(() => {
    setEmployees(getAllEmployees);
    setFilteredEmployees(getAllEmployees);
  }, [getAllEmployees]);

  useEffect(() => {
    setSpecializations(getAllSpecializations);
    setFilteredSpecializations(getAllSpecializations);
  }, [getAllSpecializations]);

  useEffect(() => {
    if (generatedReport.report) {
      setItemsArray((state) => (
        [...state, generatedReport]
      ));
      setActiveReport(generatedReport.id);
    }
    setColumnsArray(columns);
    // setTotalDuration(getTotalDuration);
  }, [generatedReport, columns]);

  useEffect(() => {
    setLoading(reportLoading);
  }, [reportLoading]);

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
      let filter = '';
      if (selectedReport.places.length && !selectedReport.specializations.length && !selectedReport.employees.length) {
        filter = 0;
      } else if (!selectedReport.specializations.length && selectedReport.employees.length) {
        filter = 1;
      } else if (selectedReport.specializations.length && !selectedReport.employees.length) {
        filter = 2;
      } else if (selectedReport.specializations.length && selectedReport.employees.length) {
        filter = 3;
      }

      const requestObj = {
        'date-start': selectedReport.startDate,
        'date-end': selectedReport.endDate,
        objects: selectedReport.places.length > 0 ? `[${selectedReport.places.join(',')}]` : '[]',
        specialities: selectedReport.specializations.length > 0 ? `[${selectedReport.specializations.join(',')}]` : '',
        employees: selectedReport.employees.length > 0 ? `[${selectedReport.employees.join(',')}]` : '',
        filter,
      };

      dispatch(action(requestObj)).then((data) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download',
          `Report_${format(dateToUCT(selectedReport.startDate),
            'yyyy-MM-dd')}_${format(dateToUCT(selectedReport.endDate), 'yyyy-MM-dd')}.${ext}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }).catch();
    }
  };

  const handleInputChange = (term, items, setter) => {
    const filterData = () => {
      const arrayCopy = [...items];
      return arrayCopy.filter((item) => item.label.toLowerCase().includes(term.toLowerCase()));
    };
    setter(filterData);
  };

  const filterChecked = (checkedArray, type) => {
    switch (type) {
      case 'places':
        setCheckedPlaces(checkedArray);

        if (checkedEmployees.length && !checkedSpecializations.length) {
          dispatch(getReportsSpecializations({
            objects: checkedArray.map((place) => place.id),
            employees: checkedEmployees.map((emp) => emp.id),
          })).then().catch();
        } else if (checkedSpecializations.length && !checkedEmployees.length) {
          dispatch(getReportsEmployees({
            objects: checkedArray.map((place) => place.id),
            specializations: checkedSpecializations.map((spec) => spec.id),
          })).then().catch();
        } else if (!checkedSpecializations.length && !checkedEmployees.length) {
          dispatch(getReportsEmployees({
            objects: checkedArray.map((place) => place.id),
            specializations: checkedSpecializations.map((spec) => spec.id),
          })).then().catch();
          dispatch(getReportsSpecializations({
            objects: checkedArray.map((place) => place.id),
            employees: checkedEmployees.map((emp) => emp.id),
          })).then().catch();
        }
        break;
      case 'employees':
        setCheckedEmployees(checkedArray);

        if (checkedSpecializations.length && !checkedPlaces.length) {
          dispatch(getReportsPlaces({
            employees: checkedArray.map((emp) => emp.id),
            specializations: checkedSpecializations.map((place) => place.id),
          })).then().catch();
        } else if (checkedPlaces.length && !checkedSpecializations.length) {
          dispatch(getReportsSpecializations({
            objects: checkedPlaces.map((place) => place.id),
            employees: checkedArray.map((emp) => emp.id),
          })).then().catch();
        } else if (!checkedPlaces.length && !checkedSpecializations.length) {
          dispatch(getReportsPlaces({
            employees: checkedArray.map((emp) => emp.id),
            specializations: checkedSpecializations.map((place) => place.id),
          })).then().catch();
          dispatch(getReportsSpecializations({
            objects: checkedPlaces.map((place) => place.id),
            employees: checkedArray.map((emp) => emp.id),
          })).then().catch();
        }
        break;
      case 'spec':
        setCheckedSpecializations(checkedArray);

        if (checkedEmployees.length && !checkedPlaces.length) {
          dispatch(getReportsPlaces({
            employees: checkedEmployees.map((emp) => emp.id),
            specializations: checkedArray.map((place) => place.id),
          })).then().catch();
        } else if (checkedPlaces.length && !checkedEmployees.length) {
          dispatch(getReportsEmployees({
            objects: checkedPlaces.map((place) => place.id),
            specializations: checkedArray.map((spec) => spec.id),
          })).then().catch();
        } else if (!checkedPlaces.length && !checkedEmployees.length) {
          dispatch(getReportsEmployees({
            objects: checkedPlaces.map((place) => place.id),
            specializations: checkedArray.map((spec) => spec.id),
          })).then().catch();
          dispatch(getReportsPlaces({
            employees: checkedEmployees.map((emp) => emp.id),
            specializations: checkedArray.map((place) => place.id),
          })).then().catch();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <div
          style={{
            display: 'flex',
            width: 'calc(100vw - 353px)',
            overflow: 'hidden',
            height: itemsArray.length > 0 ? '85px' : 0,
          }}
        >
          <div
            ref={reportTabs}
            style={{
              display: 'flex',
              width: 'calc(100vw - 353px)',
              overflowX: 'auto',
              maxHeight: '100px',
              height: 'fit-content',
            }}
          >
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
        </div>
        <div className={mainContainerClasses} 
             style={{ height: itemsArray.length > 0 ? `calc(100vh - 125px)` : 'calc(100vh - 40px)' }}>
          {
            itemsArray.length > 0 && activeReport
              ? itemsArray.map((report) => report.id === activeReport && (
                <DataTable
                  key={report.id.toString()}
                  data={report.report || []}
                  columns={columnsArray || []}
                  onColumnsChange={setColumnsArray}
                  loading={loading}
                  onSort={sortHandler}
                  selectedItem={selectedItem}
                  totalDuration={report.totalDuration}
                  setSelectedItem={rowSelectionHandler}
                  reports
                  downloadExcel={() => downloadReport(downloadExcel, 'xls')}
                  downloadPdf={() => downloadReport(downloadPdf, 'pdf')}
                  verticalOffset='127px'
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
              <>
                <div className={styles.sidebarTitle}>Objects</div>
                <Input
                  icon={<SearchIcon />}
                  placeholder='Search by objects'
                  onChange={(e) => handleInputChange(e.target.value, places, setFilteredPlaces)}
                  fullWidth
                />
                <div className={styles.checkboxGroupWrapper}>
                  <CheckboxGroupWrapper items={filteredPlaces} onChange={(c) => filterChecked(c, 'places')} />
                </div>
              </>
            }
            {
              <>
                <div className={styles.sidebarTitle}>Employees</div>
                <Input
                  icon={<SearchIcon />}
                  placeholder='Search by employees'
                  onChange={(e) => handleInputChange(e.target.value, employees, setFilteredEmployees)}
                  fullWidth
                />
                <div className={styles.checkboxGroupWrapper}>
                  <CheckboxGroupWrapper items={filteredEmployees} onChange={(c) => filterChecked(c, 'employees')} />
                </div>
              </>
            }
            {
              <>
                <div className={styles.sidebarTitle}>Specialization</div>
                <Input
                  icon={<SearchIcon />}
                  placeholder='Search by specialization'
                  onChange={(e) => handleInputChange(e.target.value, specializations, setFilteredSpecializations)}
                  fullWidth
                />
                <div className={styles.checkboxGroupWrapper}>
                  <CheckboxGroupWrapper items={filteredSpecializations} onChange={(c) => filterChecked(c, 'spec')} />
                </div>
              </>
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
