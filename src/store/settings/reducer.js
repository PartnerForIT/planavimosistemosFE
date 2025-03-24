import { success, error } from 'redux-saga-requests';
import {
  GET_SETTINGS_COMPANY,
  GET_SETTINGS_COMPANY_SUCCESS,
  ADD_SETTING_SNACKBAR,
  DISMISS_SETTING_SNACKBAR,
  GET_SETTINGS_WORK_TIME,
  GET_SETTINGS_WORK_TIME_SUCCESS,
  GET_WORKING_DAYS,
  GET_WORKING_DAYS_SUCCESS,
  GET_HOLIDAYS,
  GET_HOLIDAYS_SUCCESS,
  ADD_HOLIDAY_SUCCESS,
  DELETE_HOLIDAY_SUCCESS,
  GET_SECURITY_COMPANY,
  GET_SECURITY_COMPANY_SUCCESS,
  PATCH_SECURITY_COMPANY_SUCCESS,
  GET_SETTINGS_SKILLS,
  GET_SETTINGS_SKILLS_SUCCESS,
  CREATE_SKILL_SUCCESS,
  GET_PLACE,
  GET_PLACE_SUCCESS,
  GET_CUSTOM_CATEGORY,
  GET_CUSTOM_CATEGORY_SUCCESS,
  GET_COMPANY_SHIFT,
  GET_COMPANY_SHIFT_SUCCESS,
  GET_COMPANY_JOB_TYPE,
  GET_COMPANY_JOB_TYPE_SUCCESS,
  GET_SETTINGS_EMPLOYEES,
  GET_SETTINGS_EMPLOYEES_SUCCESS,
  GET_ACTIVITY_LOG,
  GET_ACTIVITY_LOG_SUCCESS,
  GET_DELETE_DATA,
  GET_DELETE_DATA_SUCCESS,
  GET_LOGBOOK_JOURNAL,
  GET_LOGBOOK_JOURNAL_SUCCESS,
  EDIT_LOGBOOK_JOURNAL_SUCCESS,
  GET_LOGBOOK_OVERTIME,
  GET_LOGBOOK_OVERTIME_SUCCESS,
  EDIT_LOGBOOK_OVERTIME_SUCCESS,
  GET_LOGBOOK_ADDITIONAL_RATES,
  GET_LOGBOOK_ADDITIONAL_RATES_SUCCESS,
  EDIT_LOGBOOK_ADDITIONAL_RATES_SUCCESS,
  GET_LOGBOOK_CLOCK,
  GET_LOGBOOK_CLOCK_SUCCESS,
  EDIT_LOGBOOK_CLOCK_SUCCESS,
  GET_AUTO_DELETE,
  GET_AUTO_DELETE_SUCCESS,
  EDIT_AUTO_DELETE_SUCCESS,
  GET_TIME_SHEET,
  GET_TIME_SHEET_SUCCESS,
  EDIT_TIME_SHEET_SUCCESS,
  GET_INTEGRATIONS,
  GET_INTEGRATIONS_SUCCESS,
  EDIT_INTEGRATIONS_SUCCESS,
  IMPORT_IIKO_RESULT,
  GET_ACCOUNTS_GROUPS_SUCCESS,
  GET_ACCOUNTS_GROUPS,
  CREATE_ACCOUNTS_GROUP,
  CREATE_ACCOUNTS_GROUP_SUCCESS,
  CREATE_ACCOUNTS_GROUP_ERROR,
  DELETE_ACCOUNTS_GROUP,
  DELETE_ACCOUNTS_GROUP_SUCCESS,
  DELETE_ACCOUNTS_GROUP_ERROR,
  CREATE_ACCOUNTS_SUBGROUP,
  CREATE_ACCOUNTS_SUBGROUP_SUCCESS,
  CREATE_ACCOUNTS_SUBGROUP_ERROR,
  DELETE_ACCOUNTS_SUBGROUP,
  DELETE_ACCOUNTS_SUBGROUP_SUCCESS,
  DELETE_ACCOUNTS_SUBGROUP_ERROR,
  PATCH_ACCOUNTS_GROUP,
  PATCH_ACCOUNTS_GROUP_ERROR,
  PATCH_ACCOUNTS_GROUP_SUCCESS,
  PATCH_ACCOUNTS_SUBGROUP,
  PATCH_ACCOUNTS_SUBGROUP_SUCCESS,
  PATCH_ACCOUNTS_SUBGROUP_ERROR,
  GET_ROLES,
  GET_ROLES_SUCCESS,
  GET_ROLES_ERROR,
  CREATE_ROLE,
  CREATE_ROLE_ERROR,
  CREATE_ROLE_SUCCESS,
  DELETE_ROLE,
  DELETE_ROLE_ERROR,
  DELETE_ROLE_SUCCESS,
  UPDATE_ROLE,
  UPDATE_ROLE_ERROR,
  UPDATE_ROLE_SUCCESS,
  GET_ROLE_DETAILS,
  GET_ROLE_DETAILS_ERROR,
  GET_ROLE_DETAILS_SUCCESS,
  GET_TIME_OFFS,
  GET_TIME_OFFS_SUCCESS,
  GET_TIME_OFFS_ERROR,
  CREATE_TIME_OFF,
  CREATE_TIME_OFF_ERROR,
  CREATE_TIME_OFF_SUCCESS,
  DELETE_TIME_OFF,
  DELETE_TIME_OFF_ERROR,
  DELETE_TIME_OFF_SUCCESS,
  UPDATE_TIME_OFF,
  UPDATE_TIME_OFF_ERROR,
  UPDATE_TIME_OFF_SUCCESS,
  GET_POLICIES,
  GET_POLICIES_SUCCESS,
  GET_POLICIES_ERROR,
  CREATE_POLICY,
  CREATE_POLICY_ERROR,
  CREATE_POLICY_SUCCESS,
  DELETE_POLICY,
  DELETE_POLICY_ERROR,
  DELETE_POLICY_SUCCESS,
  UPDATE_POLICY,
  UPDATE_POLICY_ERROR,
  UPDATE_POLICY_SUCCESS,
  DUPLICATE_POLICY,
  DUPLICATE_POLICY_ERROR,
  DUPLICATE_POLICY_SUCCESS,
  GET_SETTINGS_EMPLOYEES_ERROR,
  GET_SETTINGS_EMPLOYEES_ALL,
  GET_SETTINGS_EMPLOYEES_EDIT,
  GET_SETTINGS_EMPLOYEES_EDIT_ERROR,
  GET_SETTINGS_EMPLOYEES_EDIT_SUCCESS,
  UPDATE_EMPLOYEE,
  UPDATE_EMPLOYEE_ERROR,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_LOGBOOK,
  UPDATE_EMPLOYEE_LOGBOOK_ERROR,
  UPDATE_EMPLOYEE_LOGBOOK_SUCCESS,
  GET_CURRENCY_SUCCESS,
  DELETE_EMPLOYEE,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_ERROR,
  EMPLOYEE_ACTIONS,
  EMPLOYEE_ACTIONS_SUCCESS,
  EMPLOYEE_ACTIONS_ERROR,
  CREATE_EMPLOYEE,
  CREATE_EMPLOYEE_ERROR,
  LOAD_PERMISSIONS,
  LOAD_PERMISSIONS_SUCCESS,
  LOAD_PERMISSIONS_ERROR,
  GET_SETTINGS_EMPLOYEES_QUERY,
  GET_CURRENCY,
  SEND_IMPORTED_EMPLOYEES,
  SEND_IMPORTED_EMPLOYEES_SUCCESS,
  SEND_IMPORTED_EMPLOYEES_ERROR,
  SEND_IMPORTED_PLACES,
  SEND_IMPORTED_PLACES_SUCCESS,
  SEND_IMPORTED_PLACES_ERROR,
  GET_EVENTS,
  GET_EVENTS_SUCCESS,
  PATCH_EVENT,
  PATCH_EVENT_SUCCESS,
  DELETE_EVENT,
  DELETE_EVENT_SUCCESS,
  POST_EVENT_SUCCESS,
  GET_SETTINGS_SCHEDULE,
  GET_SETTINGS_SCHEDULE_SUCCESS,
  GET_SETTINGS_SCHEDULE_ERROR, EMPLOYEE_DROP_STATUS,
} from './types';

const initialState = {
  company: {},
  workTime: {
    days: [],
    national_holidays: [],
    working_days: [],
    work_time: {},
  },
  security: {},
  journal: {},
  overtime: {},
  additionalRates: {},
  clock: {},
  autoDelete: {},
  timeSheet: {},
  integrations: {},
  skills: [],
  employees: {
    users: [],
    stats: {},
  },
  employee: {},
  activity_log: [],
  deleteData: [],
  places: [],
  customCategories: [],
  shifts: [],
  loading: false,
  employeeLoading: false,
  error: null,
  snackbarText: '',
  snackbarShow: false,
  snackbarType: '',
  groups: [],
  currency: [],
  roles: [],
  roleDetails: {},
  time_offs: [],
  policies: [],
  policiesLoading: false,
  permissions: [],
  import: {},
  importPlaces: {},
  events: [],
  schedule: {},
  scheduleLoading: false,
  errorCreatingEmployer: undefined,
};

function filterdeleteHoliday(array, id) {
  return array.filter((item) => item.id !== id);
}

export const reducerOrganizationList = (state = initialState, action) => {
  switch (action.type) {
    case GET_SETTINGS_COMPANY:
      return {
        ...state,
        error: null,
        loading: true,
        settingsLoading: true,
      };
    case GET_SETTINGS_COMPANY_SUCCESS:
      return {
        ...state,
        company: action.data,
        error: null,
        loading: false,
        settingsLoading: false,
      };

    case GET_CURRENCY: {
      return {
        ...state,
        settingsLoading: true,
      };
    }
    case GET_CURRENCY_SUCCESS:
      return {
        ...state,
        currency: action.data,
        settingsLoading: false,
      };

    case GET_SETTINGS_WORK_TIME:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case GET_SETTINGS_WORK_TIME_SUCCESS:
      return {
        ...state,
        workTime: {
          days: action.data ? action.data.days : [],
          national_holidays: action.data ? action.data.national_holidays : [],
          working_days: action.data ? action.data.working_days : [],
          work_time: action.data ? action.data.work_time : {},
        },
        error: null,
        loading: false,
      };
      case GET_WORKING_DAYS:
      return {
        ...state,
        error: null,
        //loading: true,
      };
    case GET_WORKING_DAYS_SUCCESS:
      return {
        ...state,
        workTime: {
          ...state.workTime,
          work_time: action.data ? action.data.work_time : [],
          working_days: action.data ? action.data.working_days : [],
        },
        error: null,
        loading: false,
      };
    case GET_HOLIDAYS:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case GET_HOLIDAYS_SUCCESS:
      return {
        ...state,
        workTime: {
          ...state.workTime,
          national_holidays: action.data ? action.data.national_holidays : [],
        },
        error: null,
        loading: false,
      };
    case ADD_HOLIDAY_SUCCESS: {
      return {
        ...state,
        workTime: {
          days: [...state.workTime.days],
          national_holidays: [...state.workTime.national_holidays],
          work_time: {
            ...state.workTime.work_time,
            holidays: [...state.workTime.work_time.holidays, action.data],
          },
        },
      };
    }
    case DELETE_HOLIDAY_SUCCESS: {
      return {
        ...state,
        workTime: {
          days: [...state.workTime.days],
          national_holidays: [...state.workTime.national_holidays],
          work_time: {
            ...state.workTime.work_time,
            holidays: filterdeleteHoliday(state.workTime.work_time.holidays, action.id),
          },
        },
      };
    }
    case GET_SECURITY_COMPANY: {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case GET_SECURITY_COMPANY_SUCCESS: {
      return {
        ...state,
        security: action.data,
        error: null,
        loading: false,
      };
    }
    case PATCH_SECURITY_COMPANY_SUCCESS: {
      return {
        ...state,
        security: action.data,
        error: null,
        loading: false,
      };
    }
    case GET_SETTINGS_SKILLS: {
      return {
        ...state,
        loading: true,
      };
    }
    case GET_SETTINGS_SKILLS_SUCCESS: {
      return {
        ...state,
        loading: false,
        skills: action.data,
      };
    }
    case CREATE_SKILL_SUCCESS: {
      return {
        ...state,
        skills: [...state.skills, action.data],
      };
    }
    case GET_PLACE: {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case GET_PLACE_SUCCESS: {
      return {
        ...state,
        loading: false,
        places: action.data,
      };
    }
    case GET_CUSTOM_CATEGORY: {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case GET_CUSTOM_CATEGORY_SUCCESS: {
      return {
        ...state,
        loading: false,
        customCategories: action.data,
      };
    }
    case GET_COMPANY_SHIFT: {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case GET_COMPANY_SHIFT_SUCCESS: {
      return {
        ...state,
        loading: false,
        shifts: action.data.shifts,
      };
    }
    case GET_COMPANY_JOB_TYPE: {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case GET_COMPANY_JOB_TYPE_SUCCESS: {
      return {
        ...state,
        loading: false,
        job_types: action.data,
      };
    }
    case GET_SETTINGS_EMPLOYEES:
    case GET_SETTINGS_EMPLOYEES_QUERY:
    {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case GET_SETTINGS_EMPLOYEES_ALL:
      return {
        ...state,
        error: null,
        employeesLoading: true,
      };

    case GET_SETTINGS_EMPLOYEES_SUCCESS: {
      return {
        ...state,
        loading: false,
        employees: action.data,
        employeesLoading: false,
      };
    }

    case UPDATE_EMPLOYEE:
      return {
        ...state,
        employeesLoading: true,
        error: null,
      };

    case UPDATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employee: { ...action.data },
        employeesLoading: false,
      };

    case UPDATE_EMPLOYEE_ERROR:
      return {
        ...state,
        employeesLoading: false,
        error: action.data,
      };

    case UPDATE_EMPLOYEE_LOGBOOK:
      return {
        ...state,
        employeesLoading: true,
        error: null,
      };

    case UPDATE_EMPLOYEE_LOGBOOK_SUCCESS:
      return {
        ...state,
        employee: { ...action.data },
        employeesLoading: false,
      };

    case UPDATE_EMPLOYEE_LOGBOOK_ERROR:
      return {
        ...state,
        employeesLoading: false,
        error: action.data,
      };

    case GET_SETTINGS_EMPLOYEES_EDIT:
      return {
        ...state,
        error: null,
        employeeLoading: true,
      };
    case GET_SETTINGS_EMPLOYEES_EDIT_SUCCESS:
      return {
        ...state,
        employee: action.data,
        employeeLoading: false,
      };
    case GET_SETTINGS_EMPLOYEES_EDIT_ERROR:
      return {
        ...state,
        employeeLoading: false,
      };

    case GET_SETTINGS_EMPLOYEES_ERROR:
      return {
        ...state,
        loading: false,
      };

    case DELETE_EMPLOYEE:
    case EMPLOYEE_ACTIONS:
      return {
        ...state,
        employeesLoading: true,
      };

    case EMPLOYEE_ACTIONS_SUCCESS:
    case DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employeesLoading: false,
      };

    case EMPLOYEE_ACTIONS_ERROR:
    case DELETE_EMPLOYEE_ERROR:
      return {
        ...state,
        employeesLoading: false,
        error: action.data,
      };

    case GET_ACTIVITY_LOG: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case GET_ACTIVITY_LOG_SUCCESS: {
      return {
        ...state,
        loading: false,
        activity_log: action.data,
        error: null,
      };
    }
    case GET_DELETE_DATA: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case GET_DELETE_DATA_SUCCESS: {
      return {
        ...state,
        loading: false,
        deleteData: action.data,
        error: null,
      };
    }
    case GET_LOGBOOK_JOURNAL: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case GET_LOGBOOK_JOURNAL_SUCCESS: {
      return {
        ...state,
        loading: false,
        journal: action.data,
        error: null,
      };
    }
    case EDIT_LOGBOOK_JOURNAL_SUCCESS: {
      return {
        ...state,
        journal: action.data,
      };
    }
    case GET_TIME_SHEET: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case GET_TIME_SHEET_SUCCESS: {
      return {
        ...state,
        loading: false,
        timeSheet: action.data,
        error: null,
      };
    }
    case EDIT_TIME_SHEET_SUCCESS: {
      return {
        ...state,
        timeSheet: action.data,
      };
    }
    case GET_INTEGRATIONS: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case GET_INTEGRATIONS_SUCCESS: {
      return {
        ...state,
        loading: false,
        integrations: action.data,
        error: null,
      };
    }
    case EDIT_INTEGRATIONS_SUCCESS: {
      return {
        ...state,
        integrations: action.data,
      };
    }
    case GET_LOGBOOK_OVERTIME: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case GET_LOGBOOK_OVERTIME_SUCCESS: {
      return {
        ...state,
        loading: false,
        overtime: action.data,
        error: null,
      };
    }

    case EDIT_LOGBOOK_OVERTIME_SUCCESS: {
      return {
        ...state,
        loading: false,
        overtime: action.data,
        error: null,
      };
    }
    case GET_LOGBOOK_ADDITIONAL_RATES: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case GET_LOGBOOK_ADDITIONAL_RATES_SUCCESS: {
      return {
        ...state,
        loading: false,
        additionalRates: action.data,
        error: null,
      };
    }

    case EDIT_LOGBOOK_ADDITIONAL_RATES_SUCCESS: {
      return {
        ...state,
        loading: false,
        additionalRates: action.data,
        error: null,
      };
    }
    case GET_LOGBOOK_CLOCK: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case GET_LOGBOOK_CLOCK_SUCCESS: {
      return {
        ...state,
        loading: false,
        clock: action.data,
        error: null,
      };
    }

    case EDIT_LOGBOOK_CLOCK_SUCCESS: {
      return {
        ...state,
        loading: false,
        clock: action.data,
        error: null,
      };
    }
    case GET_AUTO_DELETE: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case GET_AUTO_DELETE_SUCCESS: {
      return {
        ...state,
        loading: false,
        autoDelete: action.data,
        error: null,
      };
    }

    case EDIT_AUTO_DELETE_SUCCESS: {
      return {
        ...state,
        loading: false,
        autoDelete: action.data,
        error: null,
      };
    }
    case IMPORT_IIKO_RESULT:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case GET_ACCOUNTS_GROUPS:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ACCOUNTS_GROUPS_SUCCESS: {
      return {
        ...state,
        loading: false,
        groups: action.data,
        error: null,
      };
    }

    case CREATE_ACCOUNTS_GROUP:
    case DELETE_ACCOUNTS_GROUP:
    case PATCH_ACCOUNTS_GROUP:
      return {
        ...state,
        groupLoading: true,
        error: null,
      };

    case CREATE_ACCOUNTS_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        groupLoading: false,
        groups: [...state.groups, action.data],
        error: null,
      };

    case PATCH_ACCOUNTS_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        groupLoading: false,
        groups: [...action.data],
        error: null,
      };

    case CREATE_ACCOUNTS_GROUP_ERROR:
    case DELETE_ACCOUNTS_GROUP_ERROR:
    case PATCH_ACCOUNTS_GROUP_ERROR:
      return {
        ...state,
        groupLoading: false,
      };

    case DELETE_ACCOUNTS_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        groupLoading: false,
        groups: [...action.data],
        error: null,
      };

    case CREATE_ACCOUNTS_SUBGROUP:
    case DELETE_ACCOUNTS_SUBGROUP:
    case PATCH_ACCOUNTS_SUBGROUP:
      return {
        ...state,
        subgroupLoading: true,
        error: null,
      };

    case CREATE_ACCOUNTS_SUBGROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        subgroupLoading: false,
        groups: [...action.data],
        error: null,
      };

    case CREATE_ACCOUNTS_SUBGROUP_ERROR:
    case DELETE_ACCOUNTS_SUBGROUP_SUCCESS:
    case DELETE_ACCOUNTS_SUBGROUP_ERROR:
    case PATCH_ACCOUNTS_SUBGROUP_SUCCESS:
    case PATCH_ACCOUNTS_SUBGROUP_ERROR:
      return {
        ...state,
        subgroupLoading: false,
      };

    case GET_ROLES:
    case CREATE_ROLE:
    case DELETE_ROLE:
    case UPDATE_ROLE:
    case GET_ROLE_DETAILS:
      return {
        ...state,
        rolesLoading: true,
        error: null,
      };

    case GET_ROLES_SUCCESS:
    case CREATE_ROLE_SUCCESS:
    case DELETE_ROLE_SUCCESS:
    case UPDATE_ROLE_SUCCESS:
      return {
        ...state,
        rolesLoading: false,
        roles: action.data?.accountRoles || action.data,
      };

    case GET_ROLE_DETAILS_SUCCESS:
      return {
        ...state,
        rolesLoading: false,
        roleDetails: action.data.accountRoles,
      };

    case DELETE_ROLE_ERROR:
    case CREATE_ROLE_ERROR:
    case GET_ROLES_ERROR:
    case UPDATE_ROLE_ERROR:
    case GET_ROLE_DETAILS_ERROR:
      return {
        ...state,
        rolesLoading: false,
        error: action.data.accountRoles,
      };


    case GET_TIME_OFFS:
    case CREATE_TIME_OFF:
    case DELETE_TIME_OFF:
    case UPDATE_TIME_OFF:
      return {
        ...state,
        timeOffsLoading: true,
        error: null,
      };

    case GET_TIME_OFFS_SUCCESS:
    case CREATE_TIME_OFF_SUCCESS:
    case DELETE_TIME_OFF_SUCCESS:
    case UPDATE_TIME_OFF_SUCCESS:
      return {
        ...state,
        timeOffsLoading: false,
        time_offs: action.data?.time_offs || action.data,
      };

    case GET_TIME_OFFS_ERROR:
    case DELETE_TIME_OFF_ERROR:
    case CREATE_TIME_OFF_ERROR:
    case UPDATE_TIME_OFF_ERROR:
      return {
        ...state,
        timeOffsLoading: false,
        error: action.data.time_offs,
      };

    case GET_POLICIES:
    case CREATE_POLICY:
    case DELETE_POLICY:
    case UPDATE_POLICY:
    case DUPLICATE_POLICY:
      return {
        ...state,
        policiesLoading: true,
        error: null,
      };

    case GET_POLICIES_SUCCESS:
    case CREATE_POLICY_SUCCESS:
    case DELETE_POLICY_SUCCESS:
    case UPDATE_POLICY_SUCCESS:
    case DUPLICATE_POLICY_SUCCESS:
      return {
        ...state,
        policiesLoading: false,
        policies: action.data?.policies || action.data,
      };

    case GET_POLICIES_ERROR:
    case DELETE_POLICY_ERROR:
    case CREATE_POLICY_ERROR:
    case UPDATE_POLICY_ERROR:
    case DUPLICATE_POLICY_ERROR:
      return {
        ...state,
        policiesLoading: false,
        error: action.data.policies,
      };

    case ADD_SETTING_SNACKBAR:
      return {
        ...state,
        snackbarText: action.data,
        snackbarType: action.snackbarType,
        snackbarShow: true,
      };
    case DISMISS_SETTING_SNACKBAR:
      return {
        ...state,
        snackbarText: action.data,
        snackbarShow: false,
        snackbarType: '',
      };

    case error(CREATE_EMPLOYEE):
      return {
        ...state,
        errorCreatingEmployer: true,
      };

    case success(CREATE_EMPLOYEE):
      return {
        ...state,
        errorCreatingEmployer: false,
      };
    case CREATE_EMPLOYEE_ERROR:
      return {
        ...state,
        error: action.data,
      };

    case EMPLOYEE_DROP_STATUS:
      console.log('222')
      return {
        ...state,
        errorCreatingEmployer: undefined,
      };

    case LOAD_PERMISSIONS:
      return {
        ...state,
        error: null,
      };

    case LOAD_PERMISSIONS_SUCCESS:
      return {
        ...state,
        permissions: action.data,
      };

    case LOAD_PERMISSIONS_ERROR:
      return {
        ...state,
        error: action.data,
      };

    case CREATE_EMPLOYEE:
      return { ...state, 
          loading: true,
          settingsLoading: true,
        }

    case SEND_IMPORTED_EMPLOYEES:
      return { ...state, importLoading: true };

    case SEND_IMPORTED_EMPLOYEES_SUCCESS:
      return { ...state, import: action.data, importLoading: false };

    case SEND_IMPORTED_EMPLOYEES_ERROR:
      return { ...state, importLoading: false };

    case SEND_IMPORTED_PLACES:
      return { ...state, importLoading: true };

    case SEND_IMPORTED_PLACES_SUCCESS:
      return { ...state, importPlaces: action.data, importLoading: false };

    case SEND_IMPORTED_PLACES_ERROR:
      return { ...state, importLoading: false };

    /* events */
    case GET_EVENTS:
      return { ...state, eventsLoading: true };
    case GET_EVENTS_SUCCESS:
      return {
        ...state,
        events: action.data.events,
        eventsTypes: action.data.events_types,
        eventsLoading: false,
      };

    case POST_EVENT_SUCCESS:
      return {
        ...state,
        events: [
          ...state.events,
          {
            ...action.data,
            assign_employees: [],
          },
        ],
      };

    case PATCH_EVENT:
      return {
        ...state,
        eventUpdateLoading: true,
      };
    case PATCH_EVENT_SUCCESS: {
      const itemIndex = state.events.findIndex((item) => item.id === action.data.id);
      return {
        ...state,
        events: [
          ...state.events.slice(0, itemIndex),
          {
            ...state.events[itemIndex],
            assign_employees: action.employees === undefined
              ? state.events[itemIndex].assign_employees
              : state.employees.users.filter((item) => action.employees.includes(item.id)),
            ...action.data,
          },
          ...state.events.slice(itemIndex + 1),
        ],
        eventUpdateLoading: false,
      };
    }

    case DELETE_EVENT:
      return {
        ...state,
        eventUpdateLoading: true,
      };
    case DELETE_EVENT_SUCCESS: {
      const itemIndex = state.events.findIndex((item) => item.id === action.id);
      return {
        ...state,
        events: [
          ...state.events.slice(0, itemIndex),
          ...state.events.slice(itemIndex + 1),
        ],
        eventUpdateLoading: false,
      };
    }

    /* Schedule */
    case GET_SETTINGS_SCHEDULE: {
      return {
        ...state,
        scheduleLoading: true,
      };
    }
    case GET_SETTINGS_SCHEDULE_SUCCESS: {
      return {
        ...state,
        schedule: action.data,
        scheduleLoading: false,
      };
    }
    case GET_SETTINGS_SCHEDULE_ERROR: {
      return {
        ...state,
        scheduleLoading: false,
      };
    }

    default:
      return state;
  }
};

export default reducerOrganizationList;
