import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';

import MaynLayout, { AdminContext } from '../Core/MainLayout';
import CurrencySign from '../shared/CurrencySign';
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
  totalDurationSelector,
  workTimeLoadingSelector,
} from '../../store/worktime/selectors';
import { employeesSelector } from '../../store/employees/selectors';
import { changeStatusItems, getWorkTime, removeItems } from '../../store/worktime/actions';
import { getEmployees } from '../../store/employees/actions';
import { getJobTypes } from '../../store/jobTypes/actions';
import avatar from '../Icons/avatar.png';
import Timeline from '../Core/Timeline/Timeline';
import { dateToUCT, minutesToString } from '../Helpers';
import InfoCard from '../Core/InfoCard/InfoCard';
import InfoIcon from '../Icons/InfoIcon';
import CheckboxIcon from '../Icons/CheckboxIcon';
import PendingIcon from '../Icons/PendingIcon';
import { skillsSelector } from '../../store/skills/selectors';
import { getSkills } from '../../store/skills/actions';
import ApprovedIcon from '../Icons/ApprovedIcon';
import SuspendedIcon from '../Icons/SuspendedIcon';
import { companyModules } from '../../store/company/selectors';
import ApproveIcon from '../Icons/ApproveIcon';
import SuspendIcon from '../Icons/SuspendIcon';
import { downloadExcel, downloadPdf } from '../../store/reports/actions';
import { userSelector } from '../../store/auth/selectors';

const TextWithSign = ({ label }) => (
  <>
    {label}
    {', '}
    <CurrencySign />
  </>
);

const columns = [
  { label: 'Status', field: 'status', checked: true },
  { label: 'Employee', field: 'employee', checked: true },
  { label: 'Skill', field: 'skill', checked: true },
  { label: 'Place', field: 'place', checked: true },
  { label: 'Job Type', field: 'jobType', checked: true },
  { label: 'Start', field: 'start', checked: true },
  { label: 'End', field: 'end', checked: true },
  { label: 'Duration, h', field: 'duration', checked: true },
  { label: <TextWithSign label='Earnings' />, field: 'sallary', checked: true },
  { label: <TextWithSign label='Cost' />, field: 'cost', checked: true },
  { label: <TextWithSign label='Profit' />, field: 'profit', checked: true },
];
const columnsWidth = {
  status: 250,
  employee: 'auto',
  skill: 120,
  start: 100,
  end: 100,
  place: 140,
  jobType: 140,
  duration: 180,
  sallary: 140,
  cost: 140,
  profit: 140,
};

const Logbook = () => {
  /* Data table */
  const [itemsArray, setItemsArray] = useState([]);
  const [columnsArray, setColumnsArray] = useState([]);
  const [columnsWidthArray, setColumnsWidthArray] = useState({});
  const [totalDuration, setTotalDuration] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(null);
  // const [page, setPage] = useState(1);

  const [dateRange, setDateRange] = useState({});

  const [skills, setSkills] = useState([]);
  const [checkedSkills, setCheckedSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);

  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wTime = useSelector(workTimeSelector);
  const workTimeLoading = useSelector(workTimeLoadingSelector);
  const getAllEmployees = useSelector(employeesSelector);
  const getTotalDuration = useSelector(totalDurationSelector);
  const selectSkills = useSelector(skillsSelector);
  const modules = useSelector(companyModules);
  const { id: companyId } = useParams();
  const user = useSelector(userSelector);
  const isSuperAdmin = useContext(AdminContext);

  const [approval, setApproval] = useState(false);
  const [workTime, setWorkTime] = useState([]);

  const [total, setTotal] = useState({ salary: 0, cost: 0, profit: 0 });

  useEffect(() => {
    const { cost_earning: costEarning, profitability: profitAccess } = modules;

    setWorkTime(wTime.map((day) => {
      const { items } = day;
      let cost = 0;
      let sallary = 0;
      let profit = 0;

      const newDay = {
        ...day,
        items: items.map(({ profitability = {}, ...rest }) => {
          const { cost: itemCost, sallary: itemSalary, profit: itemProfit } = profitability;

          cost += itemCost;
          sallary += itemSalary;
          profit += itemProfit;

          setTotal((prevState) => ({
            profit: prevState.profit + profit,
            salary: prevState.salary + sallary,
            cost: prevState.cost + cost,
          }));

          return {
            ...rest,
            ...profitability,
          };
        }),
      };

      return {
        ...newDay,
        ...costEarning ? { cost } : {},
        ...profitAccess ? { profit, sallary } : {},
      };
    }));
  }, [modules, wTime]);

  useEffect(() => {
    const { use_approval_flow: approveFlow } = modules;
    const superAdmin = user ? user.role_id : false;

    // TODO: get approval option from role
    if (superAdmin === 1 || (approveFlow === 1 && user.roles[0])) {
      setApproval(true);
    } else {
      setApproval(false);
    }
  }, [modules, user]);

  const [sortStatus, setSortStatus] = useState([]);

  const sorting = (status) => {
    setSortStatus((prevState) => {
      if (prevState.find((i) => i === status)) {
        return prevState.filter((i) => i !== status);
      }
      return [...prevState, status];
    });
  };

  const icons = {
    status: [
      {
        value: 'Pending',
        icon: <PendingIcon />,
        onClick: (status) => sorting(status),
      },
      {
        value: 'Approved',
        icon: <ApprovedIcon />,
        onClick: (status) => sorting(status),
      },
      {
        value: 'Suspended',
        icon: <SuspendedIcon />,
        onClick: (status) => sorting(status),
      },
    ],
  };

  const statusSelector = (status) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Approved';
      case 2:
        return 'Suspended';
      case 'approve':
      case 'Approve':
        return 1;
      case 'suspend':
      case 'Suspend':
        return 2;
      default:
        return 0;
    }
  };

  useEffect(() => {
    dispatch(getJobTypes(companyId)).then().catch();
    dispatch(getEmployees(companyId)).then().catch();
    dispatch(getSkills(companyId)).then().catch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendRequest = useCallback((props = {}) => {
    const { startDate, endDate } = dateRange;
    if (startDate && !endDate) return;
    dispatch(getWorkTime(companyId, {
      startDate: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : '',
      endDate: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : '',
      search,
      employees: checkedEmployees.map((item) => item.id),
      skills: checkedSkills.map((item) => item.id),
      ...props,
    })).then(() => {
      setCheckedItems([]);
      setSelectedItem(null);
    }).catch();
  }, [checkedEmployees, checkedSkills, companyId, dateRange, dispatch, search]);

  useEffect(() => {
    sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  useEffect(() => {
    if (Array.isArray(workTime)) {
      setItemsArray(workTime.map((item) => {
        let { items } = item;

        if (items?.length) {
          items = items
            .map((it) => ({ ...it, status: statusSelector(it.works[0].status) }))
            .filter((it) => !sortStatus.some((status) => status === it.status));
        }
        return { ...item, items };
      }).filter(({ items }) => items.length));
      setColumnsWidthArray(columnsWidth);
      setTotalDuration(getTotalDuration);
    }
  }, [workTime, getTotalDuration, sortStatus]);

  useEffect(() => {
    const { cost_earning: costEarning, profitability } = modules;
    let allColumnsArray = columns;
    if (!profitability) {
      if (!costEarning) {
        allColumnsArray = columns
          .filter(({ field }) => (field !== 'sallary' && field !== 'profit' && field !== 'cost'));
      } else {
        allColumnsArray = columns.filter(({ field }) => (field !== 'sallary' && field !== 'profit'));
      }
    }

    if (!isSuperAdmin) {
      if (!modules.create_places) {
        allColumnsArray = allColumnsArray.filter((column) => column.field !== 'place');
      }

      if (!modules.create_jobs) {
        allColumnsArray = allColumnsArray.filter((column) => column.field !== 'jobType');
      }
    }

    setColumnsArray(allColumnsArray);
  }, [modules, isSuperAdmin]);

  useEffect(() => {
    setLoading(workTimeLoading);
  }, [workTimeLoading]);

  useEffect(() => {
    if (Array.isArray(selectSkills)) {
      setSkills(selectSkills);
    }
  }, [selectSkills]);

  useEffect(() => {
    if (Array.isArray(getAllEmployees)) {
      setEmployees(getAllEmployees);
    }
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
  };

  const onSkillsSelectChange = (selectedSkills) => {
    setCheckedSkills(selectedSkills);
  };
  const onSkillsSelectFilter = () => {
    sendRequest({ skills: checkedSkills.map((item) => item.id) });
  };

  const onEmployeesSelectChange = (selectedEmployees) => {
    setCheckedEmployees(selectedEmployees);
  };
  const onEmployeesSelectFilter = () => {
    sendRequest({ employees: checkedEmployees.map((item) => item.id) });
  };

  const searchHandler = (term) => {
    setSearch(term);
    sendRequest({ search: term });
  };

  const deleteItems = () => {
    const confirm = window.confirm('Are you sure you want to delete this entry/entries?');
    if (confirm) {
      dispatch(removeItems(companyId, { items: checkedItems.map((item) => (item.id)) })).then(() => {
        sendRequest();
      }).catch();
    }
  };

  const changeItemStatus = (status, entryId = null) => {
    const confirm = window.confirm(`Are you sure you want to ${status} this entry/entries?`);
    if (confirm) {
      dispatch(changeStatusItems(companyId, {
        items: entryId ?? checkedItems.map((item) => (item.id)),
        status: statusSelector(status),
      })).then(() => {
        sendRequest();
      }).catch();
    }
  };

  const downloadReport = (action, ext) => {
    const { startDate, endDate } = dateRange;

    const checkedEmp = checkedEmployees.map((item) => item.id);
    const checkedSk = checkedSkills.map((item) => item.id);
    const requestObj = {
      'date-start': startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : null,
      'date-end': endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : null,
      // places: null,
      // jobTypes: null,
      employees: checkedEmp.length ? checkedEmp : null,
      skills: checkedSk.length ? checkedSk : null,
    };

    dispatch(action(companyId, requestObj)).then(({ data }) => {
      // eslint-disable-next-line no-shadow
      const { startDate, endDate } = dateRange;
      // Insert a link that allows the user to download the PDF file
      const link = document.createElement('a');
      link.download = _.isEmpty(dateRange) ? `Report_${format(new Date(), 'yyyy-MM-dd')}.${ext}`
        : `Report_${format(startDate,
          'yyyy-MM-dd')}_${format(endDate,
          'yyyy-MM-dd')}.${ext}`;
      link.href = `data:application/octet-stream;base64,${data}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch();
  };

  const EmployeeInfo = () => (
    <div className={styles.employeeInfo}>
      <div className={styles.hero}>
        <img src={avatar} alt={selectedItem.employee} width='71' height='72' />
        <div className={styles.employeeName}>{selectedItem.employee}</div>
        <div className={styles.date}>
          {
            format(
              new Date(
                dateToUCT(selectedItem.works[0].started_at).getTime()
                + dateToUCT(selectedItem.works[0].started_at)
                  .getTimezoneOffset() * 60 * 1000,
              ), 'iii, dd, MMMM, yyyy',
            )
          }
        </div>
        <Delimiter />
        {
          selectedItem && (
            <>
              <Scrollbar
                style={{ height: `calc(100vh - 218px - ${approval ? '64px' : '0px'})` }}
                removeTracksWhenNotUsed
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
                <Timeline
                  works={selectedItem.works}
                  breaks={selectedItem.breaks}
                  total={selectedItem.total_work_sec + selectedItem.total_break_sec}
                  startMinute={selectedItem.started_at}
                  startTime={selectedItem.start}
                  endTime={selectedItem.end}
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
                  durationSec={selectedItem.total_break_sec}
                />
              </Scrollbar>
              {
                approval
                && (
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.approve}
                      onClick={() => changeItemStatus('approve', selectedItem.id)}
                    >
                      <span aria-hidden><ApproveIcon aria-hidden /></span>
                      <span>{t('Approve')}</span>
                    </button>
                    <button
                      className={styles.suspend}
                      onClick={() => changeItemStatus('suspend', selectedItem.id)}
                    >
                      <span aria-hidden><SuspendIcon aria-hidden /></span>
                      <span>{t('Suspend')}</span>
                    </button>
                  </div>
                )
              }
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
            {checkedItems.length === 1 ? 'entry' : 'entries'}
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
        {
          approval
          && (
            <>
              <Button onClick={() => changeItemStatus('approve')} green fillWidth>
                {checkedItems.length === 1 ? t('Approve') : t('Approve All')}
              </Button>
              <Button onClick={() => changeItemStatus('suspend')} yellow fillWidth>
                {checkedItems.length === 1 ? t('Suspend') : t('Suspend All')}
              </Button>
            </>
          )
        }
        <Button onClick={deleteItems} danger fillWidth>
          {checkedItems.length === 1 ? t('Delete') : t('Delete All')}
        </Button>
      </div>
    </div>
  );

  return (
    <MaynLayout>
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <header className={styles.appHeader}>
            <DRP initRange={dateRange} onChange={setDateRange} />
            <div className={styles.hideOn660}>
              <Delimiter />
              <Input
                icon={<SearchIcon />}
                placeholder={`${t('Search')}...`}
                width='100%'
                height='36px'
                value={search}
                onChange={(e) => searchHandler(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyHandler()}
              />
            </div>
            <div className={styles.hideOn750}>
              <Delimiter />
              <CustomSelect
                placeholder={t('All skills')}
                buttonLabel={t('Filter')}
                items={skills ?? []}
                onFilter={onSkillsSelectFilter}
                onChange={onSkillsSelectChange}
                width='auto'
                type='skills'
              />
            </div>

            <div className={styles.hideOn815}>
              <Delimiter />
              <CustomSelect
                placeholder={t('All employees')}
                buttonLabel={t('Filter')}
                items={employees ?? []}
                onFilter={onEmployeesSelectFilter}
                onChange={onEmployeesSelectChange}
                width='auto'
                type='employees'
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
            lastPage={workTime?.last_page}
            activePage={workTime?.current_page}
            itemsCountPerPage={workTime?.per_page}
            totalItemsCount={workTime?.total}
            handlePagination={console.log}
            selectedItem={selectedItem}
            totalDuration={totalDuration}
            setSelectedItem={rowSelectionHandler}
            verticalOffset='123px'
            fieldIcons={icons}
            statusClickable
            sortStatus={sortStatus}
            downloadExcel={() => downloadReport(downloadExcel, 'xlsx')}
            downloadPdf={() => downloadReport(downloadPdf, 'pdf')}
            modules={modules}
            amount={total}
          />
        </div>

        <div className={styles.rightSidebar}>
          {
            // eslint-disable-next-line no-nested-ternary
            checkedItems.length > 0
              ? (
                <MultipleEntries />
              )
              : selectedItem
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
    </MaynLayout>
  );
};

export default Logbook;
