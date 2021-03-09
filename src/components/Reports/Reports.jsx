import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import Scrollbar from 'react-scrollbars-custom';
import { useParams } from 'react-router-dom';
import { companyModules } from '../../store/company/selectors';
import { loadLogbookJournal } from '../../store/settings/actions';
import { JournalDataSelector } from '../../store/settings/selectors';
import StyledCheckbox from '../Core/Checkbox/Checkbox';
import MainLayout, { AdminContext } from '../Core/MainLayout';
import CurrencySign from '../shared/CurrencySign';
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
import { jobTypesSelector } from '../../store/jobTypes/selectors';
import { getReportsEmployees } from '../../store/employees/actions';
import { getReportsJobTypes } from '../../store/jobTypes/actions';
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
import { skillsSelector } from '../../store/skills/selectors';
import { getReportsSkills } from '../../store/skills/actions';
import usePermissions from '../Core/usePermissions';

const TextWithSign = ({ label }) => (
  <>
    {label}
    {', '}
    <CurrencySign />
  </>
);

const profitabilityColumns = [
  { label: <TextWithSign label='Earnings' />, field: 'sallary', checked: true },
  { label: <TextWithSign label='Cost' />, field: 'cost', checked: true },
  { label: <TextWithSign label='Profit' />, field: 'profit', checked: true },
];

const permissionsConfig = [
  {
    name: 'reports_generate',
    permission: 'reports_generate',
  },
  {
    name: 'reports_generate',
    permission: 'reports_generate',
  },
  {
    name: 'cost',
    module: 'cost_earning',
    permission: 'reports_costs',
  },
  {
    name: 'profit',
    module: 'profitability',
    permission: 'reports_profit',
  },
  {
    name: 'earnings',
    module: 'profitability',
    permission: 'reports_earnings',
  },
  {
    name: 'places',
    module: 'create_places',
  },
  {
    name: 'jobs',
    module: 'create_jobs',
  },
  {
    name: 'reports_assigned_place',
    permission: 'reports_assigned_place',
  },
];
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

  const [jobTypes, setJobTypes] = useState([]);
  const [filteredJobTypes, setFilteredJobTypes] = useState([]);
  const [checkedJobTypes, setCheckedJobTypes] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [checkedPlaces, setCheckedPlaces] = useState([]);

  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [checkedSkills, setCheckedSkills] = useState([]);

  const [totalStat, setTotalStat] = useState({
    cost: 0,
    sallary: 0,
    profit: 0,
  });

  const [costState, setCostState] = useState({
    show_costs: false,
    show_earnings: false,
    show_profit: false,
  });

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id: companyId } = useParams();
  const permissions = usePermissions(permissionsConfig);

  const generatedReport = useSelector(reportSelector);
  const reportLoading = useSelector(reportLoadingSelector);
  const columns = useSelector(columnsSelector);
  // const getTotalDuration = useSelector(totalDurationSelector);

  const getAllEmployees = useSelector(employeesSelector);
  const getAllJobTypes = useSelector(jobTypesSelector);
  const getAllPlaces = useSelector(placesSelector);
  const getAllSkills = useSelector(skillsSelector);
  const { comments_required: comments = false } = useSelector(JournalDataSelector);
  const modules = useSelector(companyModules);
  const isSuperAdmin = useContext(AdminContext);

  const mainContainerClasses = classNames(styles.mainContainer, {
    [styles.mainContainerWithReports]: itemsArray.length,
  });

  useEffect(() => {
    dispatch(getReportsPlaces({ companyId })).then().catch();
    dispatch(getReportsEmployees({ companyId })).then().catch();
    dispatch(getReportsJobTypes({ companyId })).then().catch();
    dispatch(getReportsSkills({ companyId })).then().catch();
    dispatch(loadLogbookJournal(companyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const costsCheckboxesHandler = (id, checked) => {
    setCostState((prevState) => ({
      ...prevState,
      ...(id !== 'show_costs' && checked
        ? { show_costs: true, [id]: checked }
        : { [id]: checked }
      ),
    }));
  };

  const showCostsInReport = () => {
    // eslint-disable-next-line no-underscore-dangle
    const _temp = {};
    Object.keys(costState).map((key) => {
      if (costState[key]) {
        _temp[key] = 1;
      }
      return key;
    });
    return _temp;
  };

  const sendRequest = () => {
    const { startDate, endDate } = dateRange;
    const placesArr = checkedPlaces.map((place) => place.id);
    const jobTypesArr = checkedJobTypes.map((spec) => spec.id);
    const employeesArr = checkedEmployees.map((emp) => emp.id);
    const skillsArr = checkedSkills.map((emp) => emp.id);

    dispatch(getReport(companyId, {
      startDate: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : undefined,
      jobTypesArr,
      employeesArr,
      placesArr,
      skillsArr,
      ...showCostsInReport(),
    })).then().catch();
  };

  useEffect(() => {
    if (Array.isArray(getAllPlaces)) {
      setPlaces(getAllPlaces);
      setFilteredPlaces(getAllPlaces);
    }
  }, [getAllPlaces]);

  useEffect(() => {
    if (Array.isArray(getAllEmployees)) {
      setEmployees(getAllEmployees);
      setFilteredEmployees(getAllEmployees);
    }
  }, [getAllEmployees]);

  useEffect(() => {
    if (Array.isArray(getAllJobTypes)) {
      setJobTypes(getAllJobTypes);
      setFilteredJobTypes(getAllJobTypes);
    }
  }, [getAllJobTypes]);

  useEffect(() => {
    if (Array.isArray(getAllSkills)) {
      setSkills(getAllSkills);
      setFilteredSkills(getAllSkills);
    }
  }, [getAllSkills]);

  useEffect(() => {
    if (generatedReport.report) {
      setItemsArray((state) => {
        const reportId = generatedReport.id;
        const reportIndex = state.findIndex(({ id }) => id === reportId);
        const mappedReport = {
          ...generatedReport,
          report: generatedReport.report.map(({ items, ...rest }) => {
            let reportsCost = 0;
            let reportsSalary = 0;
            let reportsProfit = 0;

            return {
              ...rest,
              items: items.map(({ data, ...other }) => ({
                ...other,
                data: {
                  ...data,
                  columns: [...data.columns, ...profitabilityColumns]
                    .filter(({ field }) => {
                      if (!costState.show_earnings && field === 'sallary') {
                        return false;
                      } if (!costState.show_costs && field === 'cost') {
                        return false;
                      } if (!comments && field === 'comment') {
                        return false;
                      }
                      return !(!costState.show_profit && field === 'profit');
                    }),
                  items: [...data.items].map(({ profitability: prof, ...all }) => {
                    const { cost = 0, sallary = 0, profit = 0 } = prof ?? {};
                    reportsCost += cost;
                    reportsSalary += sallary;
                    reportsProfit += profit;
                    setTotalStat((prevState) => ({
                      sallary: prevState.sallary + sallary,
                      profit: prevState.profit + profit,
                      cost: prevState.profit + profit,
                    }));
                    return {
                      ...all,
                      ...(prof || {}),
                    };
                  }),
                },
              })),
              cost: reportsCost,
              sallary: reportsSalary,
              profit: reportsProfit,
            };
          }),
        };
        if (reportIndex >= 0) {
          return [...state].splice(reportIndex, 1, { ...mappedReport });
        }

        return [...state, mappedReport];
      });
      setActiveReport(generatedReport.id);
    }
    // setTotalDuration(getTotalDuration);
  }, [comments, costState.show_costs, costState.show_earnings,
    costState.show_profit, generatedReport]);

  useEffect(() => {
    setColumnsArray([...columns, ...profitabilityColumns].filter(({ field }) => {
      if (!costState.show_earnings && field === 'sallary') return false;
      if (!costState.show_profit && field === 'profit') return false;
      if (!modules.create_jobs && field === 'jobType' && !isSuperAdmin) return false;
      return !(!costState.show_costs && field === 'cost');
    }));
  }, [activeReport, columns, costState.show_costs, isSuperAdmin,
    costState.show_earnings, costState.show_profit, modules]);

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
      if (selectedReport.places?.length && !selectedReport.jobTypes?.length && !selectedReport.employees?.length) {
        filter = 0;
      } else if (!selectedReport.jobTypes?.length && selectedReport.employees?.length) {
        filter = 1;
      } else if (selectedReport.jobTypes?.length && !selectedReport.employees?.length) {
        filter = 2;
      } else if (selectedReport.jobTypes?.length && selectedReport.employees?.length) {
        filter = 3;
      }

      const requestObj = {
        'date-start': selectedReport.startDate,
        'date-end': selectedReport.endDate,
        places: selectedReport.places?.length > 0 ? `[${selectedReport.places.join(',')}]` : '[]',
        jobTypes: selectedReport.jobTypes?.length > 0 ? `[${selectedReport.jobTypes.join(',')}]` : undefined,
        employees: selectedReport.employees?.length > 0 ? `[${selectedReport.employees.join(',')}]` : undefined,
        filter,
        ...showCostsInReport(),
      };

      dispatch(action(companyId, requestObj)).then(({ data }) => {
        const link = document.createElement('a');
        link.setAttribute('download',
          `Report_${format(dateToUCT(selectedReport.startDate),
            'yyyy-MM-dd')}_${format(dateToUCT(selectedReport.endDate),
            'yyyy-MM-dd')}.${ext}`);
        link.href = `data:application/octet-stream;base64,${data}`;
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
    let requestObj = {};
    switch (type) {
      case 'places':
        setCheckedPlaces(checkedArray);

        requestObj = {
          companyId,
          places: checkedArray.map((place) => place.id),
          employees: checkedEmployees.map((emp) => emp.id),
          jobTypes: checkedJobTypes.map((jobType) => jobType.id),
          skills: checkedSkills.map((skill) => skill.id),
        };

        if (!checkedJobTypes.length) dispatch(getReportsJobTypes(requestObj)).then().catch();
        if (!checkedSkills.length) dispatch(getReportsSkills(requestObj)).then().catch();
        if (!checkedEmployees.length) dispatch(getReportsEmployees(requestObj)).then().catch();
        break;
      case 'employees':
        setCheckedEmployees(checkedArray);

        requestObj = {
          companyId,
          places: checkedPlaces.map((place) => place.id),
          employees: checkedArray.map((emp) => emp.id),
          jobTypes: checkedJobTypes.map((jobType) => jobType.id),
          skills: checkedSkills.map((skill) => skill.id),
        };

        if (!checkedJobTypes.length) dispatch(getReportsJobTypes(requestObj)).then().catch();
        if (!checkedSkills.length) dispatch(getReportsSkills(requestObj)).then().catch();
        if (!checkedPlaces.length) dispatch(getReportsPlaces(requestObj)).then().catch();
        break;
      case 'jobTypes':
        setCheckedJobTypes(checkedArray);

        requestObj = {
          companyId,
          places: checkedPlaces.map((place) => place.id),
          employees: checkedEmployees.map((emp) => emp.id),
          jobTypes: checkedArray.map((jobType) => jobType.id),
          skills: checkedSkills.map((skill) => skill.id),
        };

        if (!checkedSkills.length) dispatch(getReportsSkills(requestObj)).then().catch();
        if (!checkedPlaces.length) dispatch(getReportsPlaces(requestObj)).then().catch();
        if (!checkedEmployees.length) dispatch(getReportsEmployees(requestObj)).then().catch();
        break;
      case 'skills':
        setCheckedSkills(checkedArray);

        requestObj = {
          companyId,
          places: checkedPlaces.map((place) => place.id),
          employees: checkedEmployees.map((emp) => emp.id),
          jobTypes: checkedJobTypes.map((jobType) => jobType.id),
          skills: checkedArray.map((skill) => skill.id),
        };

        if (!checkedJobTypes.length) dispatch(getReportsJobTypes(requestObj)).then().catch();
        if (!checkedPlaces.length) dispatch(getReportsPlaces(requestObj)).then().catch();
        if (!checkedEmployees.length) dispatch(getReportsEmployees(requestObj)).then().catch();
        break;
      default:
        break;
    }
  };

  const sidebarContentClasses = classNames(
    styles.sidebarContent,
    {
      [styles.sidebarContent_withButton]: permissions.reports_generate,
    },
  );

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.leftContent}>
          {itemsArray.length > 0 && (
            <Scrollbar
              className={styles.scrollableContent}
              style={{ height: '85px' }}
              removeTracksWhenNotUsed
              disableTrackYMousewheelScrolling
              noScrollY
              trackXProps={{
                renderer: (props) => {
                  const { elementRef, ...restProps } = props;
                  return (
                    <span
                      {...restProps}
                      ref={elementRef}
                      className={classNames(styles.scrollbarTrackX, { trackX: true })}
                    />
                  );
                },
              }}
              trackYProps={{
                renderer: (props) => {
                  const { elementRef, ...restProps } = props;
                  return (
                    <span
                      {...restProps}
                      ref={elementRef}
                      className={classNames(styles.scrollbarTrackY, { trackY: true })}
                    />
                  );
                },
              }}
            >
              <div
                ref={reportTabs}
                style={{
                  display: 'flex',
                  maxHeight: '85px',
                  paddingRight: '5px',
                  width: 'fit-content',
                  paddingLeft: '10px',
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
            </Scrollbar>
          )}
          <div
            className={mainContainerClasses}
            style={{ height: itemsArray.length > 0 ? 'calc(100vh - 210px)' : 'calc(100vh - 125px)' }}
          >
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
                    downloadExcel={() => downloadReport(downloadExcel, 'xlsx')}
                    downloadPdf={() => downloadReport(downloadPdf, 'pdf')}
                    verticalOffset='212px'
                    amount={totalStat}
                    modules={modules}
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
            <div className={sidebarContentClasses}>
              <div className={styles.sidebarTitle}>Report period</div>
              <DRP initRange={dateRange} onChange={setDateRange} small right />
              {
                permissions.cost && (
                  <StyledCheckbox
                    label={t('Show Costs')}
                    id='show_costs'
                    onChange={costsCheckboxesHandler}
                    checked={costState.show_costs}
                    disabled={costState.show_profit || costState.show_earnings}
                  />
                )
              }
              {
                permissions.earnings && (
                  <StyledCheckbox
                    label={t('Show Earnings')}
                    id='show_earnings'
                    onChange={costsCheckboxesHandler}
                    checked={costState.show_earnings}
                  />
                )
              }
              {
                permissions.profit && (
                  <StyledCheckbox
                    label={t('Show Profit')}
                    id='show_profit'
                    onChange={costsCheckboxesHandler}
                    checked={costState.show_profit}
                  />
                )
              }
              {
                (permissions.places && !permissions.reports_assigned_place) && (
                  <>
                    <div className={styles.sidebarTitle}>Places</div>
                    <Input
                      icon={<SearchIcon />}
                      placeholder='Search by places'
                      onChange={(e) => handleInputChange(e.target.value, places, setFilteredPlaces)}
                      fullWidth
                    />
                    <div className={styles.checkboxGroupWrapper}>
                      <CheckboxGroupWrapper items={filteredPlaces ?? []} onChange={(c) => filterChecked(c, 'places')} />
                    </div>
                  </>
                )
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
                    <CheckboxGroupWrapper
                      items={filteredEmployees ?? []}
                      onChange={(c) => filterChecked(c, 'employees')}
                    />
                  </div>
                </>
              }
              {
                permissions.jobs && (
                  <>
                    <div className={styles.sidebarTitle}>Job types</div>
                    <Input
                      icon={<SearchIcon />}
                      placeholder='Search by job types'
                      onChange={(e) => handleInputChange(e.target.value, jobTypes, setFilteredJobTypes)}
                      fullWidth
                    />
                    <div className={styles.checkboxGroupWrapper}>
                      <CheckboxGroupWrapper
                        items={filteredJobTypes ?? []}
                        onChange={(c) => filterChecked(c, 'jobTypes')}
                      />
                    </div>
                  </>
                )
              }
              {
                <>
                  <div className={styles.sidebarTitle}>Skills</div>
                  <Input
                    icon={<SearchIcon />}
                    placeholder='Search by skills'
                    onChange={(e) => handleInputChange(e.target.value, skills, setFilteredSkills)}
                    fullWidth
                  />
                  <div className={styles.checkboxGroupWrapper}>
                    <CheckboxGroupWrapper items={filteredSkills ?? []} onChange={(c) => filterChecked(c, 'skills')} />
                  </div>
                </>
              }
            </div>
            {
              permissions.reports_generate && (
                <div className={styles.actions}>
                  <Button onClick={sendRequest} fillWidth>{t('Generate Report')}</Button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
