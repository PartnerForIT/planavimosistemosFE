import { success, error } from 'redux-saga-requests';
import {
  DELETE_ITEMS,
  GET_WORK_TIME,
} from './types';
import {
  POST_LOGBOOK_ENTRY_SUCCESS,
  POST_LOGBOOK_ADD_ENTRY_SUCCESS,
} from '../logbook/types';

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

    case POST_LOGBOOK_ENTRY_SUCCESS: {
      return {
        workTime: [
          ...action.data.work_time,
        ],
        ...state,
      };
    }
    case POST_LOGBOOK_ADD_ENTRY_SUCCESS: {
      return {
        workTime: [
          ...action.data.work_time,
        ],
        ...state,
      };
    }
    case success(GET_WORK_TIME):
      return {
        ...state,
        workTime: action.data.work_time,
        total: action.data.total,
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
