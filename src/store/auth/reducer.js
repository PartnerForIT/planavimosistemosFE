/* eslint-disable camelcase */
import { success, error } from 'redux-saga-requests';
import {
  LOGIN,
  LOGIN_CHECK, REFRESH_TOKEN,
} from './types';

const initialState = {
  user: null,
  isAuthorized: false,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case REFRESH_TOKEN:
      return { ...state, error: null, loading: true };

    case success(LOGIN):
    case success(REFRESH_TOKEN):
      localStorage.setItem('token', action.data.access_token);
      localStorage.setItem('user', JSON.stringify(action.data.user));
      localStorage.setItem('expires_in', action.data.expires_in*1 > 0 ? (new Date().getTime() + action.data.expires_in * 1000).toString() : 0);
      return {
        ...state, user: action.data.user, loading: false, isAuthorized: true,
      };

    case error(LOGIN):
      return {
        ...state, loading: false, error: action.error.response.data.message, isAuthorized: false,
      };

    case LOGIN_CHECK:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case success(LOGIN_CHECK): {
      return {
        ...state,
        user: action.data,
        loading: false,
        isAuthorized: true,
      };
    }

    case error(REFRESH_TOKEN):
    case error(LOGIN_CHECK):
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        loading: false,
        error: action.error,
        isAuthorized: false,
      };

    default: return state;
  }
};

export default reducer;
