import { ContactSupportOutlined } from '@material-ui/icons';
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
  GET_PLACE, GET_PLACE_SUCCESS,
} from './types';

const initialState = {
  company: {},
  workTime: {
    days: [],
    national_holidays: [],
    work_time: {},
  },
  security: {},
  skills: [],
  places: [],
  loading: false,
  error: null,
  snackbarText: '',
  snackbarShow: false,
  snackbarType: '',
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
      }
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
      }
    case ADD_HOLIDAY_SUCCESS: {
      return {
        ...state,
        workTime: {
          days: [...state.workTime.days],
          national_holidays: [...state.workTime.national_holidays],
          work_time: {
            ...state.workTime.work_time,
            holidays: [...state.workTime.work_time.holidays, action.data]
          }
        }
      }
    }
    case DELETE_HOLIDAY_SUCCESS: {
      return {
        ...state,
        workTime: {
          days: [...state.workTime.days],
          national_holidays: [...state.workTime.national_holidays],
          work_time: {
            ...state.workTime.work_time,
            holidays: filterdeleteHoliday(state.workTime.work_time.holidays, action.id)
          }
        }
      }
    }
    case GET_SECURITY_COMPANY: {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }
    case GET_SECURITY_COMPANY_SUCCESS: {
      return {
        ...state,
        security: action.data,
        error: null,
        loading: false,
      }
    }
    case PATCH_SECURITY_COMPANY_SUCCESS: {
      return {
        ...state,
        security: action.data,
        error: null,
        loading: false,
      }
    }
    case GET_SKILLS: {
      return {
        ...state,
        loading: true,
      }
    }
    case GET_SKILLS_SUCCESS: {
      return {
        ...state,
        loading: false,
        skills: action.data,
      }
    }
    case CREATE_SKILL_SUCCESS: {
      return {
        ...state,
        skills: [...state.skills, action.data],
      }
    }
    case GET_PLACE: {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }
    case GET_PLACE_SUCCESS: {
      return {
        ...state,
        loading: false,
        places: action.data,
      }
    }
    case ADD_SETTING_SNACKBAR:
      return {
        ...state,
        snackbarText: action.data,
        snackbarType: action.snackbarType,
        snackbarShow: true
      };
    case DISMISS_SETTING_SNACKBAR:
      return { ...state, snackbarText: action.data, snackbarShow: false, snackbarType: '' };

    default: return state;
  }
};

export default reducerOrganizationList;

function filterdeleteHoliday(array, id) {
  const arr = array.filter(item => item.id !== id)
  return arr
}