import {
  GET_SETTINGS_COMPANY,
  GET_SETTINGS_COMPANY_SUCCESS,
  ADD_SETTING_SNACKBAR,
  DISMISS_SETTING_SNACKBAR,
} from './types';

const initialState = {
  company: {},
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
    case ADD_SETTING_SNACKBAR:
      console.log('action', action)
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