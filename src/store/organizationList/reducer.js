
import {
  GET_COUNTRIES,
  GET_COUNTRIES_SUCCESS,
  GET_COUNTRIES_ERROR,
  ADD_SNACKBAR,
  DISMISS_SNACKBAR,
  GET_COMPANIES,
  GET_COMPANIES_SUCCESS,
  POST_ORGANIZATION_SUCCESS,
} from './types';

const initialState = {
  countries: [],
  companies: [],
  stats: {
    total: 0,
    active: 0,
    suspended: 0,
    terminated: 0,
  },
  loading: false,
  error: null,
  snackbarText: '',
  snackbarShow: false,
  snackbarType: '',
};

export const reducerOrganizationList = (state = initialState, action) => {
  switch (action.type) {
    case GET_COUNTRIES:
      return { ...state, error: null, loading: true };
    case GET_COUNTRIES_SUCCESS:
      return {
        ...state,
        countries: action.data,
        loading: false,
      };
      case GET_COUNTRIES_ERROR:
        return {
          ...state,
          loading: false,
          error: true,
        };

      case GET_COMPANIES:
        return {
          ...state,
          loading: true,
          error: null,
        }

      case GET_COMPANIES_SUCCESS:
        return {
          ...state,
          companies: action.data.companies,
          stats: action.data.stats,
          loading: true,
          error: null,
        }
        
      case POST_ORGANIZATION_SUCCESS:
        return {
          ...state,
          companies: [...state.companies, action.data],
          stats: {
            total: state.stats.total + 1, 
            active: state.stats.suspended + 1,
            suspended: state.stats.suspended,
            terminated: state.stats.terminated,
          } 
        }    
    
      case ADD_SNACKBAR:
          return { 
            ...state, 
            snackbarText: action.snackbarType === 'error' ? action.data.response.data.message : action.data,
            snackbarType: action.snackbarType, 
            snackbarShow: true 
          };
      case DISMISS_SNACKBAR:
          return { ...state, snackbarText: action.data, snackbarShow: false, snackbarType: '' };

    default: return state;
  }
};

export default reducerOrganizationList;