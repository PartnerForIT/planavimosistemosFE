import {
  LOGIN, SOCIAL_LOGIN, LOGIN_CHECK,
} from './types';

export const login = (email, password) => ({
  type: LOGIN,
  request: {
    method: 'POST',
    url: '/auth/login',
    data: {
      email, password,
    },
  },
  meta: {
    thunk: true,
  },
});

export const socialLogin = (profile, provider) => ({
  type: SOCIAL_LOGIN,
  request: {
    method: 'POST',
    url: '/auth/social',
    data: {
      profile, provider,
    },
  },
  meta: {
    thunk: true,
  },
});

export const authCheck = () => ({
  type: LOGIN_CHECK,
  request: {
    method: 'GET',
    url: '/auth/login',
  },
  meta: {
    thunk: true,
  },
});
