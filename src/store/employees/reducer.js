import { success, error } from 'redux-saga-requests';
import {
  GET_EMPLOYEE,
} from './types';

const initialState = {
  employees: null,
  employee: null,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EMPLOYEE:
      return { ...state, error: null, loading: true };

    case success(GET_EMPLOYEE):
      return {
        ...state, employee: action.data, loading: false,
      };

    case error(GET_EMPLOYEE):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
