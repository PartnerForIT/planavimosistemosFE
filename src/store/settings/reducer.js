import {
  GET_SETTINGS_COMPANY,
  GET_SETTINGS_COMPANY_SUCCESS,
  ADD_SETTING_SNACKBAR,
  DISMISS_SETTING_SNACKBAR,
  GET_WORK_TIME,
  GET_WORK_TIME_SUCCESS,
  ADD_HOLIDAY_SUCCESS,
  DELETE_HOLIDAY_SUCCESS,
  GET_SECURITY_COMPANY,
  GET_SECURITY_COMPANY_SUCCESS,
  PATCH_SECURITY_COMPANY_SUCCESS,
  GET_SKILLS,
  GET_SKILLS_SUCCESS,
  CREATE_SKILL_SUCCESS,
  GET_PLACE,
  GET_PLACE_SUCCESS,
  GET_EMPLOYEES,
  GET_EMPLOYEES_SUCCESS,
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
  employees: [],
  activity_log: [],
  deleteData: [],
  places: [],
  loading: false,
  error: null,
  snackbarText: '',
  snackbarShow: false,
  snackbarType: '',
  groups: [],
};

export const reducerOrganizationList = (state = initialState, action) => {
  switch (action.type) {
    case GET_SETTINGS_COMPANY:
      return { ...state, error: null, loading: true };
    case GET_SETTINGS_COMPANY_SUCCESS:
      return {
        ...state,
        company: action.data,
        error: null,
        loading: false,
      };
    case GET_WORK_TIME:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case GET_WORK_TIME_SUCCESS:
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
    case GET_SKILLS: {
      return {
        ...state,
        loading: true,
      };
    }
    case GET_SKILLS_SUCCESS: {
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
    case GET_EMPLOYEES: {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case GET_EMPLOYEES_SUCCESS: {
      return {
        ...state,
        loading: false,
        employees: action.data,
      };
    }
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
      return { ...state, groupLoading: true, error: null };

    case CREATE_ACCOUNTS_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        groupLoading: false,
        groups: [...state.groups, action.data],
        error: null,
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
        ...state, snackbarText: action.data, snackbarShow: false, snackbarType: '',
      };

    default: return state;
  }
};

export default reducerOrganizationList;

function filterdeleteHoliday(array, id) {
  const arr = array.filter((item) => item.id !== id);
  return arr;
}
