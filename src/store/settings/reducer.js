import { success, error } from 'redux-saga-requests';
import {
  GET_SETTINGS_COMPANY,
  GET_SETTINGS_COMPANY_SUCCESS,
  ADD_SETTING_SNACKBAR,
  DISMISS_SETTING_SNACKBAR,
  GET_SETTINGS_WORK_TIME,
  GET_SETTINGS_WORK_TIME_SUCCESS,
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
  GET_SETTINGS_EMPLOYEES_ERROR,
  GET_SETTINGS_EMPLOYEES_ALL,
  GET_SETTINGS_EMPLOYEES_EDIT,
  GET_SETTINGS_EMPLOYEES_EDIT_ERROR,
  GET_SETTINGS_EMPLOYEES_EDIT_SUCCESS,
  UPDATE_EMPLOYEE,
  UPDATE_EMPLOYEE_ERROR,
  UPDATE_EMPLOYEE_SUCCESS,
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
    work_time: {},
  },
  security: {},
  journal: {},
  overtime: {},
  skills: [],
  employees: {
    users: [],
    stats: {},
  },
  employee: {},
  activity_log: [],
  deleteData: [],
  places: [],
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
  permissions: [],
  import: {},
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
          work_time: action.data ? action.data.work_time : {},
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
      console.log(action.data.response.data.message);
      return {
        ...state,
        errorCreatingEmployer: true,
      };

    case success(CREATE_EMPLOYEE):
      console.log(action.data);
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

    case SEND_IMPORTED_EMPLOYEES:
      return { ...state, importLoading: true };

    case SEND_IMPORTED_EMPLOYEES_SUCCESS:
      return { ...state, import: action.data, importLoading: false };

    case SEND_IMPORTED_EMPLOYEES_ERROR:
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
