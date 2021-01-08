import { success, error } from 'redux-saga-requests';
import {
  GET_EMPLOYEE,
  GET_EMPLOYEES,
} from './types';

const initialState = {
  employees: [],
  employee: null,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EMPLOYEE:
    case GET_EMPLOYEES:
      return { ...state, error: null, loading: true };

    case success(GET_EMPLOYEE):
      return {
        ...state, employee: action.data, loading: false,
      };

    case success(GET_EMPLOYEES):
      return {
        ...state, employees: action.data, loading: false,
      };

    case error(GET_EMPLOYEE):
    case error(GET_EMPLOYEES):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
