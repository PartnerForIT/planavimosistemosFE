import { success, error } from 'redux-saga-requests';
import {
  GET_REPORT,
} from './types';

const initialState = {
  report: [],
  columns: [],
  totalDuration: null,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPORT:
      return { ...state, error: null, loading: true };

    case success(GET_REPORT):
      return {
        ...state,
        report: action.data.report,
        totalDuration: action.data.total_duration,
        columns: action.data.columns,
        loading: false,
      };

    case error(GET_REPORT):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
