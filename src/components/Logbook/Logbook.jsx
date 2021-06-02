import React, {
  useCallback, useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

import MaynLayout from '../Core/MainLayout';
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
import {
  employeesSelector,
  JournalDataSelector,
} from '../../store/settings/selectors';
import { skillsSelector } from '../../store/skills/selectors';
import { userSelector } from '../../store/auth/selectors';
import { isShowSnackbar, snackbarText, snackbarType } from '../../store/organizationList/selectors';
import { changeStatusItems, getWorkTime, removeItems } from '../../store/worktime/actions';
// import { getEmployees } from '../../store/employees/actions';
import { postLogbookEntry } from '../../store/logbook/actions';
import { getJobTypes } from '../../store/jobTypes/actions';
import { getSkills } from '../../store/skills/actions';
import { loadEmployeesAll, loadLogbookJournal } from '../../store/settings/actions';
import avatar from '../Icons/avatar.png';
import Timeline from '../Core/Timeline/Timeline';
import { dateToUCT, minutesToString } from '../Helpers';
import InfoCard from '../Core/InfoCard/InfoCard';
import CommentCard from '../Core/CommentCard/CommentCard';
import KioskCard from '../Core/KioskCard/KioskCard';
import InfoIcon from '../Icons/InfoIcon';
import CheckboxIcon from '../Icons/CheckboxIcon';
import PendingIcon from '../Icons/PendingIcon';
import ApprovedIcon from '../Icons/ApprovedIcon';
import SuspendedIcon from '../Icons/SuspendedIcon';
import ApproveIcon from '../Icons/ApproveIcon';
import SuspendIcon from '../Icons/SuspendIcon';
import { downloadExcel, downloadPdf } from '../../store/reports/actions';
import { getPlaces } from '../../store/places/actions';
import usePermissions from '../Core/usePermissions';
import useGroupingEmployees from '../../hooks/useGroupingEmployees';
import EditEntry from './EditEntry';

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
  { label: <TextWithSign label='Earnings' />, field: 'charge', checked: true },
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
  charge: 140,
  cost: 140,
  profit: 140,
};

const permissionsConfig = [
  {
    name: 'places',
    module: 'create_places',
  },
  {
    name: 'jobs',
    module: 'create_jobs',
  },
  {
    name: 'cost',
    module: 'cost_earning',
    permission: 'logbook_costs',
  },
  {
    name: 'profit',
    module: 'profitability',
    permission: 'logbook_profit',
  },
  {
    name: 'logbook_delete_logs',
    permission: 'logbook_delete_logs',
    module: 'use_approval_flow',
  },
  {
    name: 'use_approval_flow',
    module: 'use_approval_flow',
  },
  {
    name: 'approval_flow',
    module: 'use_approval_flow',
    permission: 'logbook_requests',
  },
  {
    name: 'approval_flow_in_place',
    module: 'use_approval_flow',
    permission: 'logbook_requests_in_place',
  },
  {
    name: 'comments_photo',
    module: 'comments_photo',
  },
];

const useStyles = makeStyles(() => ({
  error: {
    background: '#de4343',
    color: '#fff',
  },
  success: {
    background: '#3bc39e',
    color: '#fff',
  },
}));

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
  // const [employees, setEmployees] = useState([]);
  const [isOpenEditEntry, setIsOpenEditEntry] = useState(false);

  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const wTime = useSelector(workTimeSelector);
  const workTimeLoading = useSelector(workTimeLoadingSelector);
  const { users: employees } = useSelector(employeesSelector);
  const getTotalDuration = useSelector(totalDurationSelector);
  const selectSkills = useSelector(skillsSelector);
  const user = useSelector(userSelector);
  const journal = useSelector(JournalDataSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const { id: companyId } = useParams();
  const permissions = usePermissions(permissionsConfig);

  const [workTime, setWorkTime] = useState([]);

  const [total, setTotal] = useState({ salary: 0, cost: 0, profit: 0 });

  useEffect(() => {
    const { cost: costEarning, profit: profitAccess } = permissions;

    setWorkTime(wTime.map((day) => {
      const { items } = day;
      let cost = 0;
      let charge = 0;
      let profit = 0;

      const newDay = {
        ...day,
        items: items.map(({ profitability = {}, ...rest }) => {
          const { cost: itemCost, charge: itemSalary, profit: itemProfit } = profitability;

          cost += itemCost;
          charge += itemSalary;
          profit += itemProfit;

          setTotal((prevState) => ({
            salary: prevState.salary + charge,
            cost: prevState.cost + cost,
            profit: prevState.profit + profit,
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
        ...profitAccess ? { profit, charge } : {},
      };
    }));
  }, [permissions, wTime]);

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
    dispatch(getJobTypes(companyId));
    dispatch(getPlaces(companyId));
    // dispatch(getEmployees(companyId));
    dispatch(getSkills(companyId));
    dispatch(loadLogbookJournal(companyId));
    dispatch(loadEmployeesAll(companyId));
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
    const allColumnsArray = columns.filter((column) => {
      if (!permissions.places && column.field === 'place') {
        return false;
      }
      if (!permissions.jobs && column.field === 'jobType') {
        return false;
      }
      if (!permissions.profit && (column.field === 'charge' || column.field === 'profit')) {
        return false;
      }
      if (!permissions.cost && column.field === 'cost') {
        return false;
      }
      if ((!permissions.use_approval_flow || !journal.approve_flow) && column.field === 'status') {
        return false;
      }

      return true;
    });

    setColumnsArray(allColumnsArray);
  }, [permissions, setColumnsArray, journal.approve_flow]);

  useEffect(() => {
    setLoading(workTimeLoading);
  }, [workTimeLoading]);

  useEffect(() => {
    if (Array.isArray(selectSkills)) {
      setSkills(selectSkills);
    }
  }, [selectSkills]);

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
    sendRequest({
      employees: checkedEmployees
        .map((item) => item.id)
        .filter((item) => typeof item !== 'string'),
    });
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

  const handleClickSaveEntry = (data) => {
    dispatch(postLogbookEntry(companyId, data, sendRequest));
    setIsOpenEditEntry(false);
  };

  const photo = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAEMuMjoyKkM6NjpLR0NPZKZsZFxcZMySmnmm8dT++u3U6eX//////////+Xp////////////////////////////2wBDAUdLS2RXZMRsbMT//+n/////////////////////////////////////////////////////////////////////wAARCAMABAADASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QANxAAAgIBAwMDAwIFBAIDAAMAAAECESEDMUEEElEiYXETMoGRoQUjQrHRM1JiweHwFHLxFSSC/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAeEQEBAQACAwEBAQAAAAAAAAAAARECIQMSMUFRMv/aAAwDAQACEQMRAD8A6AA25gAAAACgAAAAABAKAAAAAAAAUAKAAAAAAAAAAIAAAAAAAAAACAFAhQQCghQAAAAAAAAAAAAAAAAAAAAAAAAAACgKAIAAAACAAAAACAAAAAAAAAAAAUCAoKICggAAAQoAgKAIAAAAAAAAAAAAAAAAACgACAAAICkAAAAAABCgogAAAAAQoAgKQAAAjQAIoAAAKAAAAAAAAAAAAAAAAAKCAAAAABQIUgAoIAKCFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAgAAoUhQAAAgKQAAAgQoKICgCAoIICgoAAAAAAAIAAKAACgAAAAgAAAAAAAAgACAAKAAAAAAAAAAAgKAIUACAoAgKQAACAQoKICgCApAAAAoAIAAAoIUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAAAAAAAAAAABAKCACggAFAAAAAAAABQICgKEKQAAAAAAFIAKCFAEAAAAIAAoAAAAAAAIAAKoACACgCAAAACgAAAAIAAAAAAACiApAgAAAAAAAAAAAAAAAKAAAAAAAAEKCCAAIAAAACgQoAAAgAAAAAKCFAAAAAAAACgACAAAAAAAAAAAAFAhQAoAAAAAAAACAIAAAAAAAAFAAAAAAAAAAAFCgAAAAAAAIAAAAAAAAAAAACAAAAAoAAgAoCoUACFAAAAAAABCgCAoAEKQAAAAAAAAAAABCgogKAICgCAoAgKAICgCAoAgAAAAAAAAAIAAAAACAoKIACA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";

  const EmployeeInfo = () => {
    const isApproval = (
      (permissions.approval_flow
        || (permissions.approval_flow_in_place && user?.employee?.place?.[0]?.id === selectedItem?.place_id)
      ) && !!journal.approve_flow
    );

    return (
      <div className={styles.employeeInfo}>
        <div className={styles.hero}>
          <Button onClick={() => setIsOpenEditEntry(true)} inverse inline size='small'>
            {t('Edit')}
          </Button>
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
                  style={{ height: `calc(100vh - 318px - ${isApproval ? '64px' : '0px'})` }}
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
                  <Delimiter />
                  {
                    (permissions.comments_photo && journal.end_day_comment && !!selectedItem.comments?.length) && (
                      <CommentCard
                        photo={journal.end_day_photo ? selectedItem.comments[0].photo : null}
                        comment={selectedItem.comments[0].comment}
                      />
                    )
                  }
                  <KioskCard
                    name={'name'}
                    photoIn={photo}
                    photoOut={photo}
                  />
                </Scrollbar>
                {
                  isApproval && (
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
        <EditEntry
          open={isOpenEditEntry}
          handleClose={() => setIsOpenEditEntry(false)}
          selectedItem={selectedItem}
          onClickSave={handleClickSaveEntry}
        />
      </div>
    );
  };

  const MultipleEntries = () => {
    const isApproval = (
      (permissions.approval_flow
      || (
        permissions.approval_flow_in_place
        && checkedItems.every((item) => user?.employee?.place?.[0]?.id === item.place_id)
      )) && !!journal.approve_flow
    );

    return (
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
            isApproval && (
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
          {
            permissions.logbook_delete_logs && (
              <Button onClick={deleteItems} danger fillWidth>
                {checkedItems.length === 1 ? t('Delete') : t('Delete All')}
              </Button>
            )
          }
        </div>
      </div>
    );
  };

  const employToCheck = useCallback(({
    id,
    name,
    surname,
  }) => ({
    id,
    label: `${name} ${surname}`,
    // checked: checkedEmployees.some(({ id: employeeId }) => employeeId === id),
  }), []);
  const allSortedEmployees = useGroupingEmployees(employees, employToCheck);

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
                items={allSortedEmployees ?? []}
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
            verticalOffset='200px'
            fieldIcons={icons}
            statusClickable
            sortStatus={sortStatus}
            downloadExcel={() => downloadReport(downloadExcel, 'xlsx')}
            downloadPdf={() => downloadReport(downloadPdf, 'pdf')}
            permissions={permissions}
            amount={total}
            white
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
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        ContentProps={{
          classes: {
            root: typeSnackbar === 'error' ? classes.error : classes.success,
          },
        }}
        severity='error'
        open={isSnackbar}
        message={textSnackbar}
        key='right'
      />
    </MaynLayout>
  );
};

export default Logbook;
