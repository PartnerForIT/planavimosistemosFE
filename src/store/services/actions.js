/* eslint-disable camelcase */
import {
  GET_INFO, CONFIRM_PASSWORD, CLEAR_SERVICES, RESET_PASSWORD,
  SET_NEW_PASSWORD, UNLOCK_ACCOUNT,
} from './types';

export const getCompanyInfo = (token) => ({
  type: GET_INFO,
  request: {
    method: 'GET',
    url: `/password/find/${token}`,
  },
  meta: {
    thunk: true,
  },
});

export const confirmPassword = ({
  token, password, email,
}) => ({
  type: CONFIRM_PASSWORD,
  request: {
    method: 'POST',
    url: '/password/reset',
    data: {
      email,
      password,
      token,
    },
  },
  meta: {
    thunk: true,
  },
});

export const clearServices = () => ({
  type: CLEAR_SERVICES,
});

export const resetPassword = (email) => ({
  type: RESET_PASSWORD,
  request: {
    method: 'POST',
    url: '/password/create-mobile',
    data: {
      email,
      reset: 1,
    },
  },
  meta: {
    thunk: true,
  },
});

export const setNewPassword = (data) => ({
  type: SET_NEW_PASSWORD,
  request: {
    method: 'POST',
    url: '/password/reset',
    data,
  },
  meta: {
    thunk: true,
  },
});
export const unlockAccount = (token) => ({
  type: UNLOCK_ACCOUNT,
  request: {
    method: 'GET',
    url: `/unlock/${token}`,
  },
  meta: {
    thunk: true,
  },
});
export const unlockUser = (data) => ({
  type: UNLOCK_USER,
  request: {
    method: 'Post',
    url: '/unlock/',
    data,
  },
  meta: {
    thunk: true,
  },
});
