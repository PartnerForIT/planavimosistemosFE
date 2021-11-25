import {
  LOGIN, LOGOUT, LOGIN_CHECK, REFRESH_TOKEN,
} from './types';

export const login = (email, password, remember) => ({
  type: LOGIN,
  request: {
    method: 'POST',
    url: '/auth/login',
    data: {
      email,
      password,
      remember,
      device: 'Web',
    },
  },
  meta: {
    thunk: true,
  },
});

export const logout = () => ({
  type: LOGOUT,
  request: {
    method: 'POST',
    url: '/auth/logout',
  },
  meta: {
    thunk: true,
  },
});

export const refreshToken = () => ({
  type: REFRESH_TOKEN,
  request: {
    method: 'POST',
    url: '/auth/refresh',
  },
  meta: {
    thunk: true,
  },
});

export const authCheck = () => ({
  type: LOGIN_CHECK,
  request: {
    method: 'POST',
    url: '/auth/me',
  },
  meta: {
    thunk: true,
  },
});
