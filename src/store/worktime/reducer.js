import { success, error } from 'redux-saga-requests';
import {
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

    case error(GET_WORK_TIME):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
