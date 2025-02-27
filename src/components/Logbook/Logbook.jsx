import React, {
  useCallback, useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';
import moment from 'moment';

import MaynLayout from '../Core/MainLayout';
import LabelWithCurrencySignComa from '../shared/LabelWithCurrencySignComa';
import DRP from '../Core/DRP/DRP';
import SearchIcon from '../Icons/SearchIcon';
import Input from '../Core/Input/Input';
import CustomSelect from '../Core/Select/Select';
import Button from '../Core/Button/Button';
import DataTable from '../Core/DataTableCustom/DTM';
import TableIcon from '../Icons/TableIcon';
import StyledCheckbox from '../Core/Checkbox/Checkbox';
import {
  workTimeSelector,
  totalSelector,
  workTimeLoadingSelector,
} from '../../store/worktime/selectors';
import {
  employeesSelector,
  JournalDataSelector,
  AdditionalRatesDataSelector,
} from '../../store/settings/selectors';
import { skillsSelector } from '../../store/skills/selectors';
import { placesSelector } from '../../store/places/selectors';
import { userSelector } from '../../store/auth/selectors';
import { changeStatusItems, getWorkTime, removeItems } from '../../store/worktime/actions';
// import { getEmployees } from '../../store/employees/actions';
import { postLogbookEntry, postLogbookAddEntry, postLogbookComment } from '../../store/logbook/actions';
import { getJobTypes } from '../../store/jobTypes/actions';
import { getSkills } from '../../store/skills/actions';
import { getCustomCategories } from '../../store/customCategories/actions';
import { customCategoriesSelector } from '../../store/customCategories/selectors';

import { loadEmployeesAll, loadLogbookJournal, patchEmployeeLogbook } from '../../store/settings/actions';
import avatar from '../Icons/avatar.png';
import Timeline from '../Core/Timeline/Timeline';
import { minutesToString } from '../Helpers';
import InfoCard from '../Core/InfoCard/InfoCard';
import CommentCard from '../Core/CommentCard/CommentCard';
import KioskCard from '../Core/KioskCard/KioskCard';
import PhotoCard from '../Core/PhotoCard/PhotoCard';
import GeolocationCard from '../Core/GeolocationCard/GeolocationCard';
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
import AddEntry from './AddEntry';
import EditComment from './EditComment';
import styles from './Logbook.module.scss';
import useCompanyInfo from '../../hooks/useCompanyInfo';

let columns = [
  { label: 'Status', field: 'status', checked: true },
  { label: 'Employee', field: 'employee', checked: true },
  { label: 'Skill', field: 'skill', checked: true },
  { label: 'Place', field: 'place', checked: true },
  { label: 'Shift', field: 'shift_name', checked: true},
  { label: 'Task', field: 'task_name', checked: true},
  { label: 'Job Type', field: 'jobType', checked: true },
  { label: 'Start', field: 'start', checked: true },
  { label: 'End', field: 'end', checked: true },
  { label: 'Duration, h', field: 'duration', checked: true },
  { label: 'Working hours, h', field: 'working_hours', checked: true },
  { label: 'Break time, h', field: 'break_time', checked: true },
  { label: 'Holiday time, h', field: 'holiday_time', checked: true },
  { label: 'Night time, h', field: 'night_duration', checked: true },
  { label: <LabelWithCurrencySignComa label='Cost' />, field: 'cost', checked: true },
  { label: <LabelWithCurrencySignComa label='Earnings' />, field: 'charge', checked: true },
  { label: <LabelWithCurrencySignComa label='Profit' />, field: 'profit', checked: true },
];
let columnsWidth = {
  status: 280,
  employee: 'auto',
  date: 250,
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
  },
  {
    name: 'logbook_edit_comments',
    permission: 'logbook_edit_comments',
  },
  {
    name: 'logbook_add_logs',
    permission: 'logbook_add_logs',
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
  {
    name: 'Shift_name',
    module: 'shift_name',
  },
  {
    name: 'night_rates',
    module: 'night_rates',
  },
  {
    name: 'schedule_shift',
    module: 'schedule_shift',
    permission: 'schedule_create_and_edit',
  },
  {
    name: 'schedule_simple',
    module: 'schedule_simple',
    permission: 'schedule_create_and_edit',
  },
  {
    name: 'schedule_module',
    permission: 'schedule_module_access',
  },
  {
    name: 'custom_category',
    module: 'custom_category',
  },
];

export default () => {
  const { getDateFormat } = useCompanyInfo();

  /* Data table */
  const [itemsArray, setItemsArray] = useState([]);
  const [columnsArray, setColumnsArray] = useState([]);
  const [columnsWidthArray, setColumnsWidthArray] = useState({});
  //const [total, setTotal] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(null);
  const AdditionalRates = useSelector(AdditionalRatesDataSelector);
  // const [page, setPage] = useState(1);

  const [dateRange, setDateRange] = useState({
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
  });

  const [places, setPlaces] = useState([]);
  const [checkedPlaces, setCheckedPlaces] = useState([]);
  const [skills, setSkills] = useState([]);
  const [checkedSkills, setCheckedSkills] = useState([]);
  const [search, setSearch] = useState('');
  // const [employees, setEmployees] = useState([]);
  const [isOpenEditEntry, setIsOpenEditEntry] = useState(false);
  const [isOpenEditComment, setIsOpenEditComment] = useState(false);
  const [isOpenAddEntry, setIsOpenAddEntry] = useState(false);
  const allCustomCategories = useSelector(customCategoriesSelector);

  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wTime = useSelector(workTimeSelector);
  const workTimeLoading = useSelector(workTimeLoadingSelector);
  const { users: employees } = useSelector(employeesSelector);
  const getTotal = useSelector(totalSelector);
  const selectSkills = useSelector(skillsSelector);
  const selectPlaces = useSelector(placesSelector);
  const user = useSelector(userSelector);
  const journal = useSelector(JournalDataSelector);
  const { id: companyId } = useParams();
  const permissions = usePermissions(permissionsConfig);

  const [workTime, setWorkTime] = useState([]);

  const [total, setTotal] = useState({ sallary: 0, cost: 0, profit: 0 });
  const [logbook_employee, setLogbookEmployee] = useState(!!user?.employee?.logbook_employee);

  moment.updateLocale('lt', {
    weekdays: ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"],
    months: [
      "Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"
    ],
    // Add any additional locale settings as needed
  });

  moment.locale(localStorage.getItem('i18nextLng') || 'en');

  useEffect(() => {
    const { cost: costEarning, profit: profitAccess } = permissions;

    setWorkTime(wTime.map((day) => {
      const { items } = day;
      let cost = day.cost;
      let charge = day.sallary;
      let profit = day.profit;

      const newDay = {
        ...day,
        items: items.map(({ profitability = {}, ...rest }) => {
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
      //(permissions.use_approval_flow && journal.approve_flow) ?
      {
        value: 'Suspended',
        hideTop: !(permissions.use_approval_flow && journal.approve_flow),
        icon: <SuspendedIcon />,
        onClick: (status) => sorting(status),
      },// : {},
      {
        value: 'Stopped by System',
        hideTop: true,
        icon: <PendingIcon />,
        onClick: (status) => sorting(status),
      },
      {
        value: 'Stopped by Manager',
        hideTop: true,
        icon: <PendingIcon />,
        onClick: (status) => sorting(status),
      },
      {
        value: 'Left geozone',
        hideTop: true,
        icon: <PendingIcon />,
        onClick: (status) => sorting(status),
      },
      {
        value: 'Out of Geozone',
        hideTop: true,
        icon: <PendingIcon />,
        onClick: (status) => sorting(status),
      },
      {
        value: 'Turned off geolocation',
        hideTop: true,
        icon: <PendingIcon />,
        onClick: (status) => sorting(status),
      },
      {
        value: 'Turned off internet or app',
        hideTop: true,
        icon: <PendingIcon />,
        onClick: (status) => sorting(status),
      },
      {
        value: 'Logged off the APP',
        hideTop: true,
        icon: <PendingIcon />,
        onClick: (status) => sorting(status),
      },
    ],
  };

  const statusSelector = (status, stoped) => {
 
    switch (status) {
      case 0: {
        console.log(stoped);
        if (stoped === 'manager') {
          return 'Stopped by Manager';
        } else if (stoped === 'geolocation_leave') {
          return "Left geozone"
        } else if (stoped === 'geoleave_with_comment') {
          return "Out of Geozone"
        } else if (stoped === 'geolocation_off') {
          return "Turned off geolocation"
        } else if (stoped === 'geolocation_app') {
          return "Turned off internet or app"
        } else if (stoped === 'logout') {
          return "Logged off the APP"
        } else if (stoped === 'daily_overtime' || stoped === 'weekly_overtime') {
          return 'Stopped by System';
        } else if (stoped === 'manager') {
          return 'Stopped by Manager';
        }
        
        return 'Pending';
      }
      case 1: {
        if (stoped === 'daily_overtime' || stoped === 'weekly_overtime') {
          return 'Stopped by System';
        } else if (stoped === 'manager') {
          return 'Stopped by Manager';
        }
        
        return 'Approved';
      }
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

  const stopedSelector = (stoped) => {
    switch (stoped) {
      case 'daily_overtime':
        return t('Clock stopped by Daily Overtime');
      case 'weekly_overtime':
        return t('Clock stopped by Weekly Overtime');
      case 'manager':
        return t('Clock stopped by Manager');
      case 'geolocation_leave':
        return t('Clock stopped by leaving geozone');
      case 'geoleave_with_comment':
        return t('Finished out of Geozone');
      case 'geolocation_off':
        return t('Clock stopped by turning off geolocation');
      case 'geolocation_app':
        return t('Clock stopped by turning off internet or app');
      case 'logout':
        return t('Clock stopped by logging off the app');
      default:
        return '';
    }
  };


  useEffect(() => {
    dispatch(getJobTypes(companyId));
    dispatch(getPlaces(companyId));
    // dispatch(getEmployees(companyId));
    dispatch(getSkills(companyId));
    dispatch(loadLogbookJournal(companyId));
    dispatch(loadEmployeesAll(companyId, {page: 'logbook'}));
    dispatch(getCustomCategories(companyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendRequest = useCallback((props = {}) => {
    const { startDate, endDate } = dateRange;
    if (startDate && !endDate) return;

    const employeesArr = checkedEmployees.map((emp) => emp.id);
    const skillsArr = checkedSkills.map((emp) => emp.id);
    const placesArr = checkedPlaces.map((emp) => emp.id);

    dispatch(getWorkTime(companyId, {
      startDate: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : '',
      endDate: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : '',
      search,
      employeesArr,
      skillsArr,
      placesArr,
      ...props,
    })).then(() => {
      setCheckedItems([]);
      setSelectedItem(null);
    });
  }, [checkedEmployees, checkedSkills, checkedPlaces, companyId, dateRange, dispatch, search]);

  useEffect(() => {
    sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  useEffect(() => {
    if (Array.isArray(workTime)) {
      if (logbook_employee) {
        let newArrange = [];
        let employeeDays = {};

        const partFormat = getDateFormat({
          'YY.MM.DD': 'YYYY. MMMM, DD',
          'DD.MM.YY': 'DD. MMMM, YYYY',
          'MM.DD.YY': 'MMMM. DD, YYYY',
        });

        const timeToMinutes = (time) => {
          if (!time) return 0;
          const [hours, minutes] = time.split(':');
          return Number(hours) * 60 + Number(minutes);
        }

        const minutesToTime = (minutes) => {
          const hours = Math.floor(minutes / 60);
          const min = minutes % 60;
          return `${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        }

        workTime.map((item) => {
          let { items } = item;
          items.map((it) => {
            if (!employeeDays[it.employee_id]) {
              employeeDays[it.employee_id] = []
            }

            employeeDays[it.employee_id].push(
              {
                ...it,
                date: moment(item.id, 'dddd, DD, MMMM, YYYY').format(`dddd, ${partFormat}`),
                status: statusSelector(it.works[0].status, it?.stoped_by),
              })

            if (!newArrange.find((i) => i.employeeId === it.employee_id)) {
              newArrange.push(
                {
                  ...item,
                  employeeId: it.employee_id,
                  label: it.employee
                })
            }

            return it;
          });

          return item;
        });

        newArrange = newArrange.map((item) => {
          return {
            ...item,
            duration: minutesToTime([...employeeDays[item.employeeId]].reduce(function(sum, current) { return sum*1 + timeToMinutes(current.duration)*1; }, 0)),
            working_hours: minutesToTime([...employeeDays[item.employeeId]].reduce(function(sum, current) { return sum*1 + timeToMinutes(current.working_hours)*1; }, 0)),
            break_time: minutesToTime([...employeeDays[item.employeeId]].reduce(function(sum, current) { return sum*1 + timeToMinutes(current.break_time)*1; }, 0)),
            holiday_time: minutesToTime([...employeeDays[item.employeeId]].reduce(function(sum, current) { return sum*1 + timeToMinutes(current.holiday_time)*1; }, 0)),
            night_duration: minutesToTime([...employeeDays[item.employeeId]].reduce(function(sum, current) { return sum*1 + timeToMinutes(current.night_duration)*1; }, 0)),
            cost: parseFloat([...employeeDays[item.employeeId]].reduce(function(sum, current) { return sum*1 + parseFloat(current.cost.replace(/,/g, ''))*1; }, 0)).toFixed(2),
            charge: parseFloat([...employeeDays[item.employeeId]].reduce(function(sum, current) { return sum*1 + parseFloat(current.charge.replace(/,/g, ''))*1; }, 0)).toFixed(2),
            profit: parseFloat([...employeeDays[item.employeeId]].reduce(function(sum, current) { return sum*1 + parseFloat(current.profit.replace(/,/g, ''))*1; }, 0)).toFixed(2),
            items: [...employeeDays[item.employeeId]],
          };
        });

        setItemsArray(newArrange ? newArrange.filter(({ items }) => items.length) : []);

        setColumnsArray(columnsArray.map((item) => { return {...item, field: (item.label === 'Employee') ? 'date' : item.field, label: (item.label === 'Employee') ? 'Date' : item.label } } ))
      } else {
        setItemsArray(workTime.map((item) => {
          let { items } = item;

          if (items?.length) {
            items = items
              .map((it) => ({ ...it, status: statusSelector(it.works[0].status, it?.stoped_by) }))
              .filter((it) => !sortStatus.some((status) => 
                status === it.status ||
                (status === 'Pending' && it.status === 'Left geozone') ||
                (status === 'Pending' && it.status === 'Out of Geozone') ||
                (status === 'Pending' && it.status === 'Turned off geolocation') ||
                (status === 'Pending' && it.status === 'Turned off internet or app') ||
                (status === 'Pending' && it.status === 'Logged off the APP') ||
                (status === 'Pending' && it.status === 'Stopped by System') ||
                (status === 'Pending' && it.status === 'Stopped by Manager')
            ));
          }

          const partFormat = getDateFormat({
            'YY.MM.DD': 'YYYY. MMMM, DD',
            'DD.MM.YY': 'DD. MMMM, YYYY',
            'MM.DD.YY': 'MMMM. DD, YYYY',
          });

          let new_label = moment(item.id, 'dddd, DD, MMMM, YYYY').format(`dddd, ${partFormat}`).toUpperCase();
          if (new_label === 'INVALID DATE') {
            new_label = moment(item.id).format(`dddd, ${partFormat}`).toUpperCase();
          }
          return {
            ...item,
            label: new_label === 'INVALID DATE' ? item.id : new_label,
            items,
          };
        }).filter(({ items }) => items.length));

        setColumnsArray(columnsArray.map((item) => { return {...item, field: (item.label === 'Date') ? 'employee' : item.field, label: (item.label === 'Date') ? 'Employee' : item.label } } ))
      }
     
      setColumnsWidthArray({...columnsWidth});
      setTotal(getTotal);
    }

    // eslint-disable-next-line
  }, [workTime, getTotal, sortStatus, logbook_employee]);

  useEffect(() => {
    let allColumnsArray = columns.filter((column) => {
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
      if (permissions.shift_name && column.field === 'shift_name') {
        return false;
      }
      if (!AdditionalRates.holiday && column.field === 'holiday_time') {
        return false;
      }
      if ((!AdditionalRates.night_time || !permissions.night_rates) && column.field === 'night_duration') {
        return false;
      }
      if ((!permissions.use_approval_flow || !journal.approve_flow) && column.field === 'status') {
        //return false;
      }
      if ((!permissions.schedule_simple && !permissions.schedule_shift) && (column.field === 'shift_name' || column.field === 'task_name')) {
        return false;
      }

      if (permissions.schedule_simple && column.field === 'shift_name') {
        return false;
      }

      if (!permissions.schedule_simple && column.field === 'task_name') {
        return false;
      }

      return true;
    });

    if (permissions.custom_category) {
      //need add it before 'start' column
      const customCategories = allCustomCategories.map((category) => {
        return {
          label: category.name,
          field: `custom_category_${category.id}`,
          checked: true,
        };
      });

      allColumnsArray = allColumnsArray.reduce((acc, item) => {
        if (item.field === 'start') {
          return [...acc, ...customCategories, item];
        }
        return [...acc, item];
      }, []);
    }

    // eslint-disable-next-line
    setColumnsArray(allColumnsArray);
    // eslint-disable-next-line
  }, [permissions, setColumnsArray, allCustomCategories, journal.approve_flow]);

  useEffect(() => {
    setLoading(workTimeLoading);
  }, [workTimeLoading]);

  useEffect(() => {
    if (Array.isArray(selectSkills)) {
      setSkills(selectSkills);
    }
  }, [selectSkills]);

  useEffect(() => {
    if (Array.isArray(selectPlaces)) {
      setPlaces(selectPlaces);
    }
  }, [selectPlaces]);

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
    setSelectedItem(selectedItem?.id === selectedRow?.id ? null : selectedRow);
  };

  const onPlacesSelectChange = (checkedPlaces) => {
    setCheckedPlaces(checkedPlaces);
  };
  const onPlacesSelectFilter = () => {
    sendRequest({ places: checkedPlaces.map((item) => item.id) });
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

  const onChangeFilterEmployee = (value) => {
    if (user.user && user.employee) {
      setLogbookEmployee(value)
      dispatch(patchEmployeeLogbook(user.user.company_id, user.employee.id, {logbook_employee: value}));
    }
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
    setLoading(true);

    const { startDate, endDate } = dateRange;

    const employeesArr = checkedEmployees.map((emp) => emp.id);
    const skillsArr = checkedSkills.map((emp) => emp.id);
    const placesArr = checkedPlaces.map((emp) => emp.id);

    const requestObj = {
      startDate: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : null,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : null,
      // places: null,
      // jobTypes: null,
      placesArr,
      employeesArr,
      skillsArr,
      columnsArray
    };

    dispatch(action(companyId, requestObj,'logbook')).then(({ data }) => {
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
      setLoading(false);
    }).catch();
  };

  const handleClickSaveEntry = (data) => {
    dispatch(postLogbookEntry(companyId, data, sendRequest));
    setIsOpenEditEntry(false);
  };

  const handleClickAddEntry = (data) => {
    dispatch(postLogbookAddEntry(companyId, data, sendRequest));
    setIsOpenAddEntry(false);
  };


  const handleClickSaveComment = (data) => {
    dispatch(postLogbookComment(companyId, data, sendRequest));
    setIsOpenEditComment(false);
  };

  const selectedItemPlace = places.find((place) => place.id === selectedItem?.place_id || place.name === selectedItem?.place);

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
          <img src={selectedItem.photo || avatar} className={styles.avatar} alt={selectedItem.employee} width='71' height='72' />
          <div className={styles.employeeName}>{selectedItem.employee}</div>
          <div className={styles.date}>
            {
              // format(
              //   new Date(
              //     dateToUCT(selectedItem.works[0].started_at).getTime()
              //       + dateToUCT(selectedItem.works[0].started_at)
              //         .getTimezoneOffset() * 60 * 1000,
              //   ), 'iii, dd, MMMM, yyyy',
              // )
            }
            {
              `${t(moment(selectedItem.works[0].started_at).format('ddd'))}, `+
              moment(selectedItem.works[0].started_at)
                .format(`${getDateFormat({
                  'YY.MM.DD': 'YYYY, MMMM, DD',
                  'DD.MM.YY': 'DD, MMMM, YYYY',
                  'MM.DD.YY': 'MMMM, DD, YYYY',
                })}`)
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
                  <Timeline
                    works={selectedItem.works}
                    breaks={selectedItem.breaks}
                    night={selectedItem.night}
                    total={selectedItem.total_work_sec}
                    startMinute={selectedItem.started_at}
                    startTime={selectedItem.start}
                    endTime={selectedItem.end}
                    withTimeBreaks
                  />
                  <Delimiter />
                  {
                    selectedItem.stoped_by && (
                      <>
                        <div className={styles.stopedBy}>
                          <PendingIcon className={styles.stopedIcon} />
                          {stopedSelector(selectedItem.stoped_by)}
                        </div>
                        <Delimiter />
                      </>
                    )
                  }
                  <InfoCard
                    type='total'
                    time={selectedItem}
                    showRange
                  />
                  <Delimiter />
                  <InfoCard
                    type='working'
                    time={selectedItem}
                    durationSec={selectedItem.working_hours_sec}
                  />
                  <Delimiter />
                  {
                    (AdditionalRates.holiday) && (
                      <>
                        <InfoCard
                          type='holiday'
                          time={selectedItem}
                          durationSec={selectedItem.holiday_minutes*60}
                        />
                        <Delimiter />
                      </>
                    )
                  }
                  {
                    (AdditionalRates.night_time && permissions.night_rates) && (
                      <>
                        <InfoCard
                          type='night'
                          time={selectedItem}
                          durationSec={selectedItem.total_night_sec}
                        />
                        <Delimiter />
                      </>
                    )
                  }
                  <InfoCard
                    type='break'
                    time={selectedItem}
                    durationSec={selectedItem.total_break_sec}
                  />
                  <Delimiter />
                  {
                    (permissions.profit) && (
                      <>
                      <InfoCard
                        type='earning'
                        time={selectedItem}
                      />
                      <Delimiter />
                      </>
                    )
                  }
                  {
                    (permissions.cost) && (
                      <>
                      <InfoCard
                        type='cost'
                        time={selectedItem}
                      />
                      <Delimiter />
                      </>
                    )
                  }
                  {
                    (permissions.profit) && (
                      <>
                      <InfoCard
                        type='profit'
                        time={selectedItem}
                      />
                      <Delimiter />
                      </>
                    )
                  }
                  {
                    (selectedItem.stoped_by !== 'manager' && permissions.comments_photo && journal.end_day_comment && !!selectedItem.comments?.length) ? (
                      <CommentCard
                        onEditComment={() => { if (permissions.logbook_delete_logs) { setIsOpenEditComment(true) } } }
                        photo={journal.end_day_photo ? selectedItem.comments[0].photo : null}
                        //width={journal.end_day_photo ? selectedItem.comments[0].photo_width : null}
                        //height={journal.end_day_photo ? selectedItem.comments[0].photo_height : null}
                        comment={selectedItem.comments[0].comment}
                      />
                    ) : null
                  }
                  {
                    selectedItem.kiosk_photo && (
                      <KioskCard
                        name={selectedItem.kiosk_photo.kiosk_name}
                        photoIn={selectedItem.kiosk_photo.photo_in}
                        photoOut={selectedItem.kiosk_photo.photo_out}
                      />
                    )
                  }

                  {
                    selectedItem.work_time_photo && (selectedItem.work_time_photo.photo_in || selectedItem.work_time_photo.photo_out) && (
                      <PhotoCard
                        photoIn={selectedItem.work_time_photo.photo_in}
                        photoOut={selectedItem.work_time_photo.photo_out}
                      />
                    )
                  }

                  {
                    selectedItemPlace && selectedItemPlace.coordinates && selectedItem.stoped_by && selectedItem.stoped_by === 'geolocation_leave' && selectedItem.coordinates && (
                      <GeolocationCard
                        coordinates={selectedItem.coordinates}
                        place={selectedItemPlace}
                      />
                    )
                  }

                  {
                    selectedItemPlace && selectedItemPlace.coordinates && selectedItem.stoped_by && selectedItem.stoped_by === 'geoleave_with_comment' && selectedItem.coordinates && (
                      <GeolocationCard
                        coordinates={selectedItem.coordinates}
                        place={selectedItemPlace}
                        comment={selectedItem.geoleave_comment}
                      />
                    )
                  }
            
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
        <EditComment
          open={isOpenEditComment}
          handleClose={() => setIsOpenEditComment(false)}
          selectedItem={selectedItem}
          onClickSave={handleClickSaveComment}
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
          {t('Multiple entries selection')}
        </div>
        <div className={styles.content}>
          <div className={styles.topBlock}>
            <CheckboxIcon className={styles.checkboxIcon} />
            <div className={styles.entryTitle}>
              {`${checkedItems.length} `}
              {checkedItems.length === 1 ? 'entry' : 'entries'}
            </div>
            <div className={styles.entryDescription}>
              {t('selected')}
            </div>
          </div>
          <div className={styles.bottomBlock}>
            <PendingIcon className={styles.clockIcon} />
            <div className={styles.entryTitle}>
              {minutesToString(checkedItems.map((item) => item.net_duration).reduce((a, b) => a + b))}
            </div>
            <div className={styles.entryDescription}>
              {t('Total Hours')}
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

  const settingsCustom = () => {

    return (
      <div className={styles.settingsCustom}>
        <StyledCheckbox
          label={t('Filter by Employee')}
          checked={logbook_employee}
          onChange={() => onChangeFilterEmployee(!logbook_employee)}
        />
      </div>
    );
  }

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
          <header onClick={() => setSelectedItem(null)} className={styles.appHeader}>
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
            <div className={styles.hideOn936}>
              <Delimiter />
              <CustomSelect
                placeholder={t('All places')}
                buttonLabel={t('Filter')}
                items={places ?? []}
                onFilter={onPlacesSelectFilter}
                onChange={onPlacesSelectChange}
                width='auto'
                type='places'
                withSearch={true}
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
                withSearch={true}
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
                withSearch={true}
              />
            </div>
            <div className={styles.hideOn936}>
              <Delimiter />
              <Button onClick={applyHandler}>{t('Apply')}</Button>
            </div>
          </header>
          <Delimiter/>
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
            //handlePagination={console.log}
            selectedItem={selectedItem}
            total={total}
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
            settingsCustom={settingsCustom()}
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
                  <div className={styles.empty}>
                    <TableIcon />
                    <div className={styles.empty__text}>
                      {t('Select any entry to get a detailed editable info or add an entry manually')}
                    </div>
                    { permissions.logbook_add_logs && (
                        <Button onClick={() => setIsOpenAddEntry(true)}>
                          {t('Add entry')}
                        </Button>
                      )
                    }
                    <AddEntry
                      open={isOpenAddEntry}
                      handleClose={() => setIsOpenAddEntry(false)}
                      onClickSave={handleClickAddEntry}
                    />


                  </div>
                )
          }
        </div>
      </div>
    </MaynLayout>
  );
};
