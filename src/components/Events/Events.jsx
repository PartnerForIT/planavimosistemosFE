import React, {
  useCallback, useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { useParams } from 'react-router-dom';

import MaynLayout from '../Core/MainLayout';
import styles from './Events.module.scss';
import DRP from '../Core/DRP/DRP';
import SearchIcon from '../Icons/SearchIcon';
import Input from '../Core/Input/Input';
import CustomSelect from '../Core/Select/Select';
import Button from '../Core/Button/Button';
import DataTable from '../Core/DataTableCustom/DTM';
import TableIcon from '../Icons/TableIcon';
import useCompanyInfo from '../../hooks/useCompanyInfo';
import { employeesSelector } from '../../store/employees/selectors';
import { AccountGroupsSelector } from '../../store/settings/selectors';
import { eventsSelector, eventsLoadingSelector } from '../../store/events/selectors';
import { getAccountGroups } from '../../store/settings/actions';
import { getEventsList, enterViewed, getEventView } from '../../store/events/actions';
import { getEmployees } from '../../store/employees/actions';
import { getJobTypes } from '../../store/jobTypes/actions';
import { getPlaces } from '../../store/places/actions';
import usePermissions from '../Core/usePermissions';
import EventCard from './EventCard';

const columns = [
  { label: 'Event Name', field: 'name', checked: true },
  { label: 'Event Rule', field: 'eventRuleName', checked: true },
  { label: 'Employee name', field: 'employee', checked: true },
  { label: 'Skill', field: 'skill', checked: true },
  { label: 'Place', field: 'place', checked: true },
  { label: 'Group', field: 'group', checked: true },
  { label: 'Sub-Group', field: 'subgroup', checked: true },
  { label: 'Timestamp', field: 'timestamp', checked: true },
];
const columnsWidth = {
  reason: 300,
  employee: 250,
  group: 200,
  place: 200,
  // timestamp: 140,
};

const permissionsConfig = [
  {
    name: 'create_groups',
    module: 'create_groups',
  },
];

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

const Events = () => {
  const { getDateFormat } = useCompanyInfo();

  const [itemsArray, setItemsArray] = useState([]);
  const [columnsArray, setColumnsArray] = useState(columns);
  const [selectedItem, setSelectedItem] = useState(null);

  const [dateRange, setDateRange] = useState({
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
  });

  const [groups, setGroups] = useState([]);
  const [checkedGroups, setCheckedGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);

  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const eventsLoading = useSelector(eventsLoadingSelector);
  const events = useSelector(eventsSelector);
  const getAllEmployees = useSelector(employeesSelector);
  const selectGroups = useSelector(AccountGroupsSelector);
  const { id: companyId } = useParams();
  const permissions = usePermissions(permissionsConfig);
  // const permissions = usePermissions(permissionsConfig);

  const sendRequest = useCallback(() => {
    const { startDate, endDate } = dateRange;
    dispatch(getEventsList(companyId, {
      date_from: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : '',
      date_to: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : '',
      search,
      employees: checkedEmployees.length ? `[${checkedEmployees.map((item) => item.id).toString()}]` : '',
      groups: checkedGroups.length ? `[${checkedGroups.map((item) => item.id).toString()}]` : '',
    }));
  }, [checkedEmployees, checkedGroups, companyId, dateRange, dispatch, search]);

  useEffect(() => {
    dispatch(getJobTypes(companyId));
    dispatch(getPlaces(companyId));
    dispatch(getEmployees(companyId));
    dispatch(getAccountGroups(companyId));
    sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const formatDate2 = getDateFormat({
      'YY.MM.DD': 'YYYY, MMMM, DD',
      'DD.MM.YY': 'DD, MMMM, YYYY',
      'MM.DD.YY': 'MMMM, DD, YYYY',
    });

    const eventsParse = events.reduce((acc, item) => {
      const nextItem = {
        ...item,
        timestamp: moment(item.timestamp).format(`${formatDate2} HH:mm`),
        time_string: moment(item.timestamp).format('DD/MM/YYYY | HH:mm'),
      };
      let time;
      if (!item.seen) {
        time = 'seen';
      } else {
        const partFormat = getDateFormat({
          'YY.MM.DD': 'YYYY. MMMM, DD',
          'DD.MM.YY': 'DD. MMMM, YYYY',
          'MM.DD.YY': 'MMMM. DD, YYYY',
        });
        time = moment(item.timestamp, 'YYYY-MM-DD HH:mm:ss').format(`dddd, ${partFormat}`).toUpperCase();
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
      //holiday: eventsParse[label][0]?.holiday,
      items: eventsParse[label],
    })));
  }, [events]);

  useEffect(() => {
    if (Array.isArray(selectGroups)) {
      setGroups(selectGroups.map((item) => ({
        ...item,
        label: item.name,
        type: item?.subgroups?.length ? 'group' : '',
        items: item?.subgroups?.length ? item?.subgroups.map((itemJ) => ({
          ...itemJ,
          label: itemJ.name,
        })) : [],
      }), []));
    }
  }, [selectGroups]);

  useEffect(() => {
    if (Array.isArray(getAllEmployees)) {
      setEmployees(getAllEmployees);
    }
  }, [getAllEmployees]);

  useEffect(() => {
    const allColumnsArray = columns.filter((column) => {
      if (!permissions.create_groups && (column.field === 'group' || column.field === 'subgroup')) {
        return false;
      }
      return true;
    });

    setColumnsArray(allColumnsArray);
  }, [permissions, setColumnsArray]);

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

    const formatDate = getDateFormat({
      'YY.MM.DD': 'YYYY, MMMM, DD',
      'DD.MM.YY': 'DD, MMMM, YYYY',
      'MM.DD.YY': 'MMMM, DD, YYYY',
    });
    
    setSelectedItem({
      ...selectedRow,
      timestamp: moment(selectedRow.timestamp, 'DD, MMMM, YYYY, HH:mm').format(`HH:mm ${formatDate}`),
    });
  };

  const onGroupsSelectChange = (selectedGroups) => {
    setCheckedGroups(selectedGroups);
  };
  const onGroupsSelectFilter = () => {
    sendRequest({ groups: checkedGroups.map((item) => item.id) });
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
                placeholder={t('All Groups')}
                buttonLabel={t('Filter')}
                items={groups ?? []}
                onFilter={onGroupsSelectFilter}
                onChange={onGroupsSelectChange}
                width='auto'
                type='groups'
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
                withSearch={true}
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
            white
          />
        </div>

        <div className={styles.rightSidebar}>
          {
            selectedItem
              ? <EventCard selectedItem={selectedItem} />
              : (
                <div className={styles.empty}>
                  <TableIcon />
                  <div className={styles.empty__text}>
                    Select any entry to get a detailed editable info
                  </div>
                </div>
              )
          }
        </div>
      </div>
    </MaynLayout>
  );
};

export default Events;
