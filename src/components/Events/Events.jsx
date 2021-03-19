import React, {
  useCallback, useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { useParams } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

import MaynLayout from '../Core/MainLayout';
import styles from './Events.module.scss';
import DRP from '../Core/DRP/DRP';
import SearchIcon from '../Icons/SearchIcon';
import Input from '../Core/Input/Input';
import CustomSelect from '../Core/Select/Select';
import Button from '../Core/Button/Button';
import DataTable from '../Core/DataTableCustom/DTM';
import TableIcon from '../Icons/TableIcon';
import { employeesSelector } from '../../store/employees/selectors';
import { skillsSelector } from '../../store/skills/selectors';
import { eventsSelector, eventsLoadingSelector } from '../../store/events/selectors';
import { isShowSnackbar, snackbarText, snackbarType } from '../../store/organizationList/selectors';
import { getEventsList, enterViewed, getEventView } from '../../store/events/actions';
import { getEmployees } from '../../store/employees/actions';
import { getJobTypes } from '../../store/jobTypes/actions';
import { getSkills } from '../../store/skills/actions';
import { getPlaces } from '../../store/places/actions';
// import usePermissions from '../Core/usePermissions';
import EventCard from './EventCard';

const columns = [
  { label: 'Reason', field: 'reason', checked: true },
  { label: 'Employee', field: 'employee', checked: true },
  { label: 'Group', field: 'group', checked: true },
  { label: 'Place', field: 'place', checked: true },
  { label: 'Timestamp', field: 'time', checked: true },
];
const columnsWidth = {
  reason: 300,
  employee: 250,
  group: 200,
  place: 200,
  // timestamp: 140,
};

// const permissionsConfig = [
//   {
//     name: 'places',
//     module: 'create_places',
//   },
//   {
//     name: 'jobs',
//     module: 'create_jobs',
//   },
//   {
//     name: 'cost',
//     module: 'cost_earning',
//     permission: 'logbook_costs',
//   },
//   {
//     name: 'profit',
//     module: 'profitability',
//     permission: 'logbook_profit',
//   },
//   {
//     name: 'logbook_delete_logs',
//     permission: 'logbook_delete_logs',
//     module: 'use_approval_flow',
//   },
//   {
//     name: 'use_approval_flow',
//     module: 'use_approval_flow',
//   },
//   {
//     name: 'approval_flow',
//     module: 'use_approval_flow',
//     permission: 'logbook_requests',
//   },
//   {
//     name: 'approval_flow_in_place',
//     module: 'use_approval_flow',
//     permission: 'logbook_requests_in_place',
//   },
// ];

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

const Events = () => {
  const [itemsArray, setItemsArray] = useState([]);
  const [columnsArray, setColumnsArray] = useState(columns);
  // const [columnsWidthArray, setColumnsWidthArray] = useState({});

  const [selectedItem, setSelectedItem] = useState(null);
  // const [loading, setLoading] = useState(null);

  const [dateRange, setDateRange] = useState({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });

  const [skills, setSkills] = useState([]);
  const [checkedSkills, setCheckedSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);

  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const eventsLoading = useSelector(eventsLoadingSelector);
  const events = useSelector(eventsSelector);
  const getAllEmployees = useSelector(employeesSelector);
  const selectSkills = useSelector(skillsSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const { id: companyId } = useParams();
  // const permissions = usePermissions(permissionsConfig);

  // const [workTime, setWorkTime] = useState([]);

  const sendRequest = useCallback(() => {
    const { startDate, endDate } = dateRange;
    dispatch(getEventsList(companyId, {
      date_from: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : '',
      date_to: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : '',
      search,
      employees: checkedEmployees.map((item) => item.id),
      skills: checkedSkills.map((item) => item.id),
    }));
  }, [checkedEmployees, checkedSkills, companyId, dateRange, dispatch, search]);

  useEffect(() => {
    dispatch(getJobTypes(companyId));
    dispatch(getPlaces(companyId));
    dispatch(getEmployees(companyId));
    dispatch(getSkills(companyId));
    sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const eventsParse = events.reduce((acc, item) => {
      const nextItem = {
        ...item,
        group: item.group?.name,
        place: item.place?.name,
        employee: item.employee?.name,
        time: moment(item.timestamp).format('DD/MM/YYYY | hh:mm'),
      };
      let time;
      if (!item.seen) {
        time = 'seen';
      } else {
        time = moment(item.timestamp).format('MMM, DD, YYYY');
      }

      if (acc[time]) {
        acc[time].push(nextItem);
      } else {
        acc[time] = [nextItem];
      }
      return acc;
    }, { seen: [] });
    if (!eventsParse.seen.length) {
      delete eventsParse.seen;
    }
    setItemsArray(Object.keys(eventsParse).map((label) => ({
      ...(label !== 'seen' ? {
        label,
      } : {
        label: `PENDING (${eventsParse[label].length})`,
        backgroundColor: 'rgba(250, 172, 46, 0.1)',
        titleColor: '#f59f13',
      }),
      items: eventsParse[label],
    })));

    // if (Array.isArray(workTime)) {
    //   setItemsArray(workTime.map((item) => {
    //     return {
    //       ...item,
    //       items: item.items.map((subItem) => ({
    //         group: subItem.group.name,
    //         place: subItem.place.name,
    //         employee: subItem.employee.name,
    //       })),
    //     };
    //   }));
    //   // setColumnsWidthArray(columnsWidth);
    // }
  }, [events]);

  // useEffect(() => {
  //   setLoading(workTimeLoading);
  // }, [eventsLoading]);

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
    if (!selectedRow.seen) {
      dispatch(getEventView(companyId, selectedRow.id));
    }

    if (selectedItem && selectedItem.id !== selectedRow.id && !selectedItem?.seen) {
      dispatch(enterViewed(selectedItem));
      // const foundItem = itemsArray[0].items.find((item) => item.id === selectedItem.id);
      // console.log('foundItem', foundItem);
      // const nextItemsArray = [
      //   ...itemsArray,
      // ];
      // nextItemsArray[0].items = nextItemsArray[0].items.filter((item) => item.id !== foundItem.id);
      // if (nextItemsArray[0].items.length) {
      //   nextItemsArray[0].label = `PENDING (${nextItemsArray[0].items.length})`;
      // } else {
      //   delete nextItemsArray[0];
      // }
      // nextItemsArray.find(() => {
      //
      // });
      // setItemsArray(itemsArray);
    }
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
            columnsWidth={columnsWidth}
            onColumnsChange={setColumnsArray}
            // todo
            // sortable
            loading={eventsLoading}
            onSort={sortHandler}
            selectedItem={selectedItem}
            setSelectedItem={rowSelectionHandler}
            verticalOffset='123px'
          />
        </div>

        <div className={styles.rightSidebar}>
          {
            selectedItem
              ? <EventCard selectedItem={selectedItem} />
              : (
                <div className={styles.emptyWrapper}>
                  <TableIcon />
                  <p>{t('Select any entry to get a detailed event info')}</p>
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

export default Events;
