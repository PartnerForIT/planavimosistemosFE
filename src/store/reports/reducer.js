import { success, error } from 'redux-saga-requests';
import {
  GET_REPORT,
  GET_FILTERS,
} from './types';

const initialState = {
  report: [],
  columns: [],
  total: null,
  places: [],
  employees: [],
  jobTypes: [],
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPORT:
    case GET_FILTERS:
      return { ...state, error: null, loading: true };

    case success(GET_REPORT):
      return {
        ...state,
        report: action.data,
        total: action.data.total,
        columns: action.data.columns,
        loading: false,
      };
    case success(GET_FILTERS):
      return {
        ...state,
        places: action.data.objects,
        employees: action.data.employees,
        jobTypes: action.data.specializations,
        loading: false,
      };

    case error(GET_REPORT):
    case error(GET_FILTERS):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
