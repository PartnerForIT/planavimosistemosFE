/* eslint-disable camelcase */
import { success, error } from 'redux-saga-requests';
import { GET_INFO, CONFIRM_PASSWORD, CLEAR_SERVICES } from './types';

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
        loading: false,
      };

    case error(GET_INFO):
      return {
        ...state, loading: false, error: action.error,
      };

    case (CONFIRM_PASSWORD):
      return {
        ...state,
        loading: true,
      };
    case success(CONFIRM_PASSWORD):
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

    default:
      return state;
  }
};

export default reducer;
