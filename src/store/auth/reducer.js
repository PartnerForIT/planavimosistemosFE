import { success, error } from 'redux-saga-requests';
import {
  LOGIN,
  LOGIN_CHECK,
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
      return { ...state, error: null, loading: true };

    case success(LOGIN):
      localStorage.setItem('token', action.data.access_token);
      localStorage.setItem('user', JSON.stringify(action.data.user));
      return {
        ...state, user: action.data.user, loading: false, isAuthorized: true,
      };

    case error(LOGIN):
      return {
        ...state, loading: false, error: action.error, isAuthorized: false,
      };

    case LOGIN_CHECK:
      return { ...state, error: null, loading: true };

    case success(LOGIN_CHECK): {
      return {
        ...state, user: action.data, loading: false, isAuthorized: true,
      };
    }

    case error(LOGIN_CHECK):
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...state, loading: false, error: action.error, isAuthorized: false,
      };

    default: return state;
  }
};

export default reducer;
