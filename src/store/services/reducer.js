/* eslint-disable camelcase */
import { success, error } from 'redux-saga-requests';
import {
  GET_INFO, CONFIRM_PASSWORD, CLEAR_SERVICES, UNLOCK_ACCOUNT, UNLOCK_USER,
} from './types';

const initialState = {
  email: '',
  security: {},
  company: {},
  loading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INFO:
      return { ...state, error: null, loading: true };

    case success(GET_INFO):
      return {
        ...state,
        email: action.data?.password?.email,
        security: action.data?.security,
        company: action.data?.company,
        admin: action.data?.is_first,
        loading: false,
      };

    case error(GET_INFO):
      return {
        ...state, loading: false, error: action.error,
      };

    case CONFIRM_PASSWORD:
      return {
        ...state,
        loading: true,
      };
    case success(CONFIRM_PASSWORD):
      localStorage.setItem('token', action.data.token);
      return {
        ...state,
        loading: false,
      };
    case error(CONFIRM_PASSWORD):
      return {
        ...state,
        loading: false,
      };

    case CLEAR_SERVICES:
      return initialState;

    case success(UNLOCK_ACCOUNT):
      return {
        ...state,
        email: action.data?.email,
        loading: false,
        error: false,
      };
    case error(UNLOCK_ACCOUNT):
      return {
        ...state, loading: false, error: true,
      };
    case success(UNLOCK_USER):
      return {
        ...state,
        loading: false,
        status: true,
      };
    case error(UNLOCK_USER):
      return {
        ...state,
        loading: false,
        status: false,
      };
    default:
      return state;
  }
};

export default reducer;
