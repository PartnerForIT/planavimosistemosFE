import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import Scrollbar from 'react-scrollbars-custom';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getCustomCategories, getCustomCategoriesValues } from '../../store/customCategories/actions';
import { customCategoriesSelector, customCategoriesValuesSelector } from '../../store/customCategories/selectors';

import { loadEmployeesAll, loadLogbookJournal } from '../../store/settings/actions';
import { JournalDataSelector } from '../../store/settings/selectors';
import StyledCheckbox from '../Core/Checkbox/Checkbox';
import MainLayout from '../Core/MainLayout';
import LabelWithCurrencySignComa from '../shared/LabelWithCurrencySignComa';
import styles from './Reports.module.scss';
import DRP from '../Core/DRP/DRP';
import Button from '../Core/Button/Button';
import DataTable from '../Core/DataTableCustom/DTM';
import {
  reportSelector,
  columnsSelector,
  reportLoadingSelector,
} from '../../store/reports/selectors';
import {
  employeesSelector,
} from '../../store/settings/selectors';
import { jobTypesSelector } from '../../store/jobTypes/selectors';
//import { getEmployees } from '../../store/employees/actions';
import { getJobTypes } from '../../store/jobTypes/actions';
import { getPlaces } from '../../store/places/actions';
import { placesSelector } from '../../store/places/selectors';

import InfoIcon from '../Icons/InfoIcon';
import ClosableCard from '../Core/ClosableCard/ClosableCard';
import ReportsIcon from '../Icons/ReportsIcon';
import CheckboxGroupWrapper from '../Core/CheckboxGroup/CheckboxGroupWrapper';
import ArrowRightIcon from '../Icons/ArrowRightIcon';
import {
  getReport, downloadExcel, downloadPdf, downloadRupExcel,
} from '../../store/reports/actions';
import SearchIcon from '../Icons/SearchIcon';
import Input from '../Core/Input/Input';
import { dateToUCT } from '../Helpers';
import { skillsSelector } from '../../store/skills/selectors';
import { getSkills } from '../../store/skills/actions';
import usePermissions from '../Core/usePermissions';
import useCompanyInfo from '../../hooks/useCompanyInfo';

import useGroupingEmployees from '../../hooks/useGroupingEmployees';

const profitabilityColumns = [
  { label: <LabelWithCurrencySignComa label='Cost' />, field: 'cost', checked: true },
  { label: <LabelWithCurrencySignComa label='Earnings' />, field: 'sallary', checked: true },
  { label: <LabelWithCurrencySignComa label='Profit' />, field: 'profit', checked: true },
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
    default: false,
  },
  {
    name: 'night_rates',
    module: 'night_rates',
  },
  {
    name: 'create_groups',
    module: 'create_groups',
  },
  {
    name: 'custom_category',
    module: 'custom_category',
  },
];
const columnsWidth = {
  // user: 500,
  // skill: 120,
  // jobType: 140,
  // group: 140,
  // subgroup: 140,
  // duration: 180,
  //
  // cost: 130,
  // sallary: 130,
  // profit: 130,
};

const useStyles = makeStyles({
  colorPrimary: {
    color: '#0087ff',
  },
});

export default () => {
  const { getDateFormat } = useCompanyInfo();

  const classes = useStyles();

  /* Reports data */
  const reportTabs = useRef(null);
  const [activeReport, setActiveReport] = useState();
  const [generateRequest, setGenerateRequest] = useState();

  /* Data table */
  const [itemsArray, setItemsArray] = useState([]);
  const [columnsArray, setColumnsArray] = useState([]);

  const allCustomCategories = useSelector(customCategoriesSelector);
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

  const [custom_category_values, setCustomCategoryValues] = useState([]);
  const [filteredCustomCategory, setFilteredCustomCategory] = useState({});
  const [checkedCustomCategoryValues, setCheckedCustomCategoryValues] = useState({});

  const [search, setSearch] = useState({place: '', employee: '', type: '', skill: '', custom_category: {}});

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

  const { users: getAllEmployees } = useSelector(employeesSelector);
  const getAllJobTypes = useSelector(jobTypesSelector);
  const getAllPlaces = useSelector(placesSelector);
  const getAllSkills = useSelector(skillsSelector);
  const getAllCustomCategoriesValues = useSelector(customCategoriesValuesSelector);
  const { end_day_comment: comments = false } = useSelector(JournalDataSelector);
  const [empList, setEmpList] = useState(getAllEmployees);
  const stringMatch = useCallback((str1 = '') => str1.toLowerCase().includes(search.employee.toLowerCase()), [search.employee]);

  useEffect(() => {
      if (search.employee.trim() && getAllEmployees) {
        const filtered = getAllEmployees.filter((e) => stringMatch(`${e.name} ${e.surname}`)
          || stringMatch(e.groups[0]?.name)
          || stringMatch(e.groups[0]?.name)
          || stringMatch(e.subgroups[0]?.name)
          || stringMatch(e.subgroups[0]?.parent_group?.name));
        setEmpList([...filtered]);
      } else {
        setEmpList([...getAllEmployees]);
      }
    }, [getAllEmployees, search.employee, stringMatch]);

  const mainContainerClasses = classNames(styles.mainContainer, {
    [styles.mainContainerWithReports]: itemsArray.length,
  });
  
  const employToCheck = useCallback(({
      id = 0,
      name,
      surname,
    }) => ({
      id,
      label: `${name} ${surname}`,
      checked: filteredEmployees.some(({ employee_id }) => employee_id === id),
    }), [filteredEmployees]);

  const allSortedEmployees = useGroupingEmployees(empList, employToCheck);

  useEffect(() => {
    dispatch(getJobTypes(companyId));
    dispatch(getPlaces(companyId));
    //dispatch(getEmployees(companyId));
    dispatch(loadEmployeesAll(companyId, { page: 'reports' }));
    dispatch(getSkills(companyId));
    // dispatch(getReportsPlaces({ companyId })).then().catch();
    // dispatch(getReportsEmployees({ companyId })).then().catch();
    // dispatch(getReportsJobTypes({ companyId })).then().catch();
    // dispatch(getReportsSkills({ companyId })).then().catch();
    dispatch(loadLogbookJournal(companyId));
    dispatch(getCustomCategories(companyId));
    dispatch(getCustomCategoriesValues(companyId));
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
    setGenerateRequest(true);
    const { startDate, endDate } = dateRange;
    const placesArr = checkedPlaces.map((place) => place.id);
    const jobTypesArr = checkedJobTypes.map((spec) => spec.id);
    const employeesArr = checkedEmployees.map((emp) => emp.id);
    const skillsArr = checkedSkills.map((emp) => emp.id);
    const customCategoryValuesArr = Object.values(checkedCustomCategoryValues).flat().map(item => item.id);
    
    dispatch(getReport(companyId, {
      startDate: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : undefined,
      jobTypesArr,
      employeesArr,
      placesArr,
      skillsArr,
      customCategoryValuesArr,
      ...showCostsInReport(),
    })).then().catch();
  };

  useEffect(() => {
    if (Array.isArray(getAllPlaces)) {
      setPlaces(getAllPlaces.map(({ id, name }) => ({ label: name, id })));
      setFilteredPlaces(getAllPlaces.map(({ id, name }) => ({ label: name, id })));
    }
  }, [getAllPlaces]);

  useEffect(() => {
    if (Array.isArray(getAllEmployees)) {
      const newEmployeesFormat = getAllEmployees.map(employee => ({
          id: employee.id,
          label: `${employee.name} ${employee.surname}`,
          photo: employee.photo,
          profitability: {
              cost: employee.profitability.cost || 0,
              sallary: employee.profitability.sallary || 0,
              profit: employee.profitability.profit || 0
          }
      }));

      setEmployees(newEmployeesFormat);
      setFilteredEmployees(newEmployeesFormat);
    }
  }, [getAllEmployees]);

  useEffect(() => {
    if (Array.isArray(getAllJobTypes)) {
      setJobTypes(getAllJobTypes.map(({ id, title }) => ({ label: title, id })));
      setFilteredJobTypes(getAllJobTypes.map(({ id, title }) => ({ label: title, id })));
    }
  }, [getAllJobTypes]);

  useEffect(() => {
    if (Array.isArray(getAllSkills)) {
      setSkills(getAllSkills);
      setFilteredSkills(getAllSkills);
    }
  }, [getAllSkills]);

  useEffect(() => {
    if (Array.isArray(getAllCustomCategoriesValues)) {
      setCustomCategoryValues(getAllCustomCategoriesValues);
      let filteredCustomCategorySorted = {};
      for (let i in getAllCustomCategoriesValues) {
        if (!filteredCustomCategorySorted[getAllCustomCategoriesValues[i].custom_category_id]) {
          filteredCustomCategorySorted[getAllCustomCategoriesValues[i].custom_category_id] = [];
        }
        filteredCustomCategorySorted[getAllCustomCategoriesValues[i].custom_category_id].push(getAllCustomCategoriesValues[i]);
      }
      setFilteredCustomCategory(filteredCustomCategorySorted);
    }
  }, [getAllCustomCategoriesValues]);

  useEffect(() => {
    const formatDate = getDateFormat({
      'YY.MM.DD': 'yyyy-MM-DD',
      'DD.MM.YY': 'DD-MM-yyyy',
      'MM.DD.YY': 'MM-DD-yyyy',
    });
    
    if (generatedReport.report && (generateRequest || activeReport)) {
      setItemsArray((state) => {
        const reportId = generatedReport.id;
        const reportIndex = state.findIndex(({ id }) => id === reportId);

        let reportsCost = 0;
        let reportsSallary = 0;
        let reportsProfit = 0;
        
        const mappedReport = {
          ...generatedReport,
          dateRange,
          placesArr: checkedPlaces.map((place) => place.id),
          jobTypesArr: checkedJobTypes.map((spec) => spec.id),
          employeesArr: checkedEmployees.map((emp) => emp.id),
          skillsArr: checkedSkills.map((emp) => emp.id),
          customCategoryValuesArr: Object.values(checkedCustomCategoryValues).flat().map(item => item.id),
          description: `${moment(generatedReport.startDate, 'YYYY-MM-DD HH:mm:ss').format(formatDate)} - ${moment(generatedReport.endDate, 'YYYY-MM-DD HH:mm:ss').format(formatDate)}`,
          report: generatedReport.report.map(({ items, ...rest }) => ({
            ...rest,
            items: items.map(({ data, ...other }) => ({
              ...other,
              data: {
                ...data,
                // columnsWidth: {
                //   date: 'auto',
                //   start: 'auto',
                //   end: 'auto',
                //   comment: 'auto',
                //   duration: 180,
                //   cost: 130,
                //   sallary: 130,
                //   profit: 130,
                // },
                columns: [
                  ...generatedReport.employee_columns.slice(0, 4),
                  {},
                  {},
                  ...generatedReport.employee_columns.slice(4),
                  ...profitabilityColumns,
                ]
                  .filter(({ field }) => {
                    if (!costState.show_earnings && field === 'sallary') {
                      return false;
                    }
                    if (!costState.show_costs && field === 'cost') {
                      return false;
                    }
                    if (!comments && field === 'comment') {
                      return false;
                    }
                    return !(!costState.show_profit && field === 'profit');
                  }),
                items: data.items.map(({ profitability: prof, ...all }) => {
                  const { cost = 0, sallary = 0, profit = 0 } = prof ?? {};
                  reportsCost += cost;
                  reportsSallary += sallary;
                  reportsProfit += profit;
                  return {
                    ...all,
                    cost,
                    sallary,
                    profit,
                  };
                }),
              },
            }))
          })),
        };

        if (reportIndex >= 0) {
          return [
            ...state.slice(0, reportIndex),
            {
              ...mappedReport,
            },
            ...state.slice(reportIndex + 1),
          ];
        }

        setTotalStat((prevState) => ({
          sallary: prevState.sallary + reportsSallary,
          profit: prevState.profit + reportsProfit,
          cost: prevState.profit + reportsCost,
        }));

        return [...state, mappedReport];
      });

      // eslint-disable-next-line
      if (activeReport && !generateRequest && generatedReport.id != activeReport) {
        const removeReport = (reps) => reps.filter((rep) => { return rep.id !== activeReport});
        setItemsArray(removeReport);
      }
      setActiveReport(generatedReport.id);
    }
    setGenerateRequest(null);
    // setTotalDuration(getTotalDuration);
    // eslint-disable-next-line
  }, [comments, costState.show_costs, costState.show_earnings,
    costState.show_profit, generatedReport]);

  useEffect(() => {
    setColumnsArray([...columns, ...profitabilityColumns].filter(({ field }) => {
      if (!costState.show_earnings && field === 'sallary') return false;
      if (!costState.show_profit && field === 'profit') return false;
      if (!permissions.jobs && field === 'jobType') return false;
      if (!permissions.create_groups && (field === 'group' || field === 'subgroup')) return false;
      if (!permissions.night_rates && field === 'night_duration') return false;
      return !(!costState.show_costs && field === 'cost');
    }));
  }, [activeReport, columns, costState.show_costs,
    costState.show_earnings, costState.show_profit, permissions]);

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
    setLoading(true);

    const selectedReport = itemsArray.find((report) => report.id === activeReport);

    const { startDate, endDate } = selectedReport?.dateRange ? selectedReport?.dateRange : dateRange;
    const placesArr = selectedReport?.placesArr ? selectedReport?.placesArr : checkedPlaces.map((place) => place.id);
    const jobTypesArr = selectedReport?.jobTypesArr ? selectedReport?.jobTypesArr : checkedJobTypes.map((spec) => spec.id);
    const employeesArr = selectedReport?.employeesArr ? selectedReport?.employeesArr : checkedEmployees.map((emp) => emp.id);
    const skillsArr = selectedReport?.skillsArr ? selectedReport?.skillsArr : checkedSkills.map((emp) => emp.id);
    const customCategoryValuesArr = selectedReport?.customCategoryValuesArr ? selectedReport?.customCategoryValuesArr : Object.values(checkedCustomCategoryValues).flat().map(item => item.id);

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
        startDate: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : undefined,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : undefined,
        jobTypesArr,
        employeesArr,
        placesArr,
        skillsArr,
        customCategoryValuesArr,
        filter,
        ...showCostsInReport(),
      };

      dispatch(action(companyId, requestObj,'reports')).then(({ data }) => {
        const link = document.createElement('a');
        link.setAttribute('download',
          `Report_${format(dateToUCT(selectedReport.startDate),
            'yyyy-MM-dd')}_${format(dateToUCT(selectedReport.endDate),
            'yyyy-MM-dd')}.${ext}`);
        link.href = `data:application/octet-stream;base64,${data}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoading(false);
      }).catch();
    }
  };

  const handleInputChange = (e, items, setter, id = false) => {
    let {
      value,
      name
    } = e.target;

    setSearch({...search, [name]: value});
    const filterData = () => {
      const arrayCopy = [...items];
      return arrayCopy.filter((item) => item.label.toLowerCase().includes(value.toLowerCase()) && (!id || item.custom_category_id === id));
    };
    
    if (id) {
      setter((prevState) => ({
        ...prevState,
        [id]: filterData(),
      }));
    } else {
      setter(filterData);
    }
  };

  const filterChecked = (checkedArray, type, id) => {
    // let requestObj = {};
    switch (type) {
      case 'places':
        setCheckedPlaces(checkedArray);
        break;
      case 'employees':
        setCheckedEmployees(checkedArray);
        break;
      case 'jobTypes':
        setCheckedJobTypes(checkedArray);
        break;
      case 'skills':
        setCheckedSkills(checkedArray);
        break;
      case 'custom_category_values':
        setCheckedCustomCategoryValues(
          (prevState) => ({
            ...prevState,
            [id]: checkedArray,
          }),
        );
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
                renderer: ({ elementRef, ...restProps }) => (
                  <span
                    {...restProps}
                    ref={elementRef}
                    className={classNames(styles.scrollbarTrackX, { trackX: true })}
                  />
                ),
              }}
              trackYProps={{
                renderer: ({ elementRef, ...restProps }) => (
                  <span
                    {...restProps}
                    ref={elementRef}
                    className={classNames(styles.scrollbarTrackY, { trackY: true })}
                  />
                ),
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
                  report.report.length > 0 ? (
                     <DataTable
                       key={report.id.toString()}
                       data={report.report || []}
                       columns={columnsArray || []}
                       columnsWidth={columnsWidth}
                       onColumnsChange={setColumnsArray}
                       loading={loading}
                       onSort={sortHandler}
                       selectedItem={selectedItem}
                       total={report.total}
                       setSelectedItem={rowSelectionHandler}
                       reports
                       downloadExcel={() => downloadReport(downloadExcel, 'xlsx')}
                       downloadRupExcel={companyId*1 === 122 ? () => downloadReport(downloadRupExcel, 'xlsx') : null}
                       downloadPdf={() => downloadReport(downloadPdf, 'pdf')}
                       verticalOffset='212px'
                       amount={totalStat}
                       withCost={permissions.cost && costState.show_costs}
                       withProfit={permissions.cost && permissions.profit && costState.show_profit}
                       withSallary={permissions.cost && permissions.profit && costState.show_earnings}
                       white
                     />
                   ) : <div className={styles.emptyContainer} key={report.id.toString()}>
                    <div className={styles.emptyContent}>
                      <div>
                        <ReportsIcon className={styles.reportsIcon} />
                        <p className={styles.title}>{t('NOTHING FOUND')}</p>
                        <p className={styles.description}>{t('Please select an object or place to generate report')}</p>
                      </div>
                      <div className={styles.arrowIcon}>
                        <ArrowRightIcon />
                      </div>
                    </div>
                  </div>
                ))
                : 
                <div className={styles.emptyContainer}>
                  {
                    loading ? 
                    (
                      <div className={classNames(styles.overlay, { [styles.overlayActive]: loading })}>
                        <CircularProgress classes={{ colorPrimary: classes.colorPrimary }} />
                      </div>
                    ) 
                    : (
                      
                        <div className={styles.emptyContent}>
                          <div>
                            <ReportsIcon className={styles.reportsIcon} />
                            <p className={styles.title}>{t('NOTHING SELECTED')}</p>
                            <p className={styles.description}>{t('Please select an object or place to generate report')}</p>
                          </div>
                          <div className={styles.arrowIcon}>
                            <ArrowRightIcon />
                          </div>
                        </div>
                      
                    )
                  }
                </div>
            }
          </div>
        </div>

        <div className={styles.rightSidebar}>
          <div className={styles.multipleEntries}>
            <div className={styles.header}>
              <InfoIcon />
              <Delimiter />
              {t('Generate Report')}
            </div>
            <div className={sidebarContentClasses}>
              <div className={styles.sidebarTitle}>{t('Report period')}</div>
              <DRP
                initRange={dateRange}
                onChange={setDateRange}
                small
                right
              />
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
                    <div className={styles.sidebarTitle}>{t('Places')}</div>
                    <Input
                      icon={<SearchIcon />}
                      placeholder={t('Search by places')}
                      value={search.place}
                      name='place'
                      onChange={(e) => handleInputChange(e, places, setFilteredPlaces)}
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
                  <div className={styles.sidebarTitle}>{t('Employees')}</div>
                  <Input
                    icon={<SearchIcon />}
                    placeholder={t('Search by employees')}
                    value={search.employee}
                    name='employee'
                    onChange={(e) => handleInputChange(e, employees, setFilteredEmployees)}
                    fullWidth
                  />
                  <div className={classNames(styles.checkboxGroupWrapper, 'styledDropdown')}>
                    <CheckboxGroupWrapper
                      items={allSortedEmployees ?? []}
                      onChange={(c) => filterChecked(c, 'employees')}
                    />
                  </div>
                </>
              }
              {
                permissions.jobs && (
                  <>
                    <div className={styles.sidebarTitle}>{t('Job types')}</div>
                    <Input
                      icon={<SearchIcon />}
                      placeholder={t('Search by job types')}
                      value={search.type}
                      name='type'
                      onChange={(e) => handleInputChange(e, jobTypes, setFilteredJobTypes)}
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
                permissions.custom_category && allCustomCategories?.length && (
                  allCustomCategories.map((category) => (
                    <div key={category.id} className={styles.sidebarBlock}>
                      <div className={styles.sidebarTitle}>
                        {category.name}
                      </div>
                      <Input
                        icon={<SearchIcon />}
                        placeholder={`${t('Search by')} ${category.name}`}
                        value={search[`custom_category_${category.id}`]}
                        name={`custom_category_${category.id}`}
                        onChange={(e) => handleInputChange(e, custom_category_values, setFilteredCustomCategory, category.id)}
                        fullWidth
                      />
                      <div className={styles.checkboxGroupWrapper}>
                        <CheckboxGroupWrapper items={filteredCustomCategory?.[category.id] || []} onChange={(c) => filterChecked(c, 'custom_category_values', category.id)} />
                      </div>
                    </div>
                  ))
                )
              }
              {
                <>
                  <div className={styles.sidebarTitle}>{t('Skills')}</div>
                  <Input
                    icon={<SearchIcon />}
                    placeholder={t('Search by skills')}
                    value={search.skill}
                    name='skill'
                    onChange={(e) => handleInputChange(e, skills, setFilteredSkills)}
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
