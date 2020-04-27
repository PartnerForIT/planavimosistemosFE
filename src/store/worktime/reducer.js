import { success, error } from 'redux-saga-requests';
import {
  DELETE_ITEMS,
  GET_WORK_TIME,
} from './types';

const initialState = {
  workTime: [],
  columns: [],
  totalDuration: null,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WORK_TIME:
    case DELETE_ITEMS:
      return { ...state, error: null, loading: true };

    case success(GET_WORK_TIME):
      return {
        ...state,
        workTime: action.data.work_time,
        totalDuration: action.data.total_duration,
        columns: action.data.columns,
        columnsWidth: action.data.columns_width,
        loading: false,
      };
    case success(DELETE_ITEMS):
      return { ...state, error: null, loading: false };

    case error(GET_WORK_TIME):
    case error(DELETE_ITEMS):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
