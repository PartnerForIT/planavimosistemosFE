import { success, error } from 'redux-saga-requests';
import {
  GET_JOB_TYPES,
} from './types';

const initialState = {
  jobTypes: [],
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_JOB_TYPES:
      return { ...state, error: null, loading: true };

    case success(GET_JOB_TYPES):
      return {
        ...state,
        jobTypes: action.data,
        loading: false,
      };

    case error(GET_JOB_TYPES):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
