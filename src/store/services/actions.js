/* eslint-disable camelcase */
import {
  GET_INFO, CONFIRM_PASSWORD, CLEAR_SERVICES, RESET_PASSWORD,
  SET_NEW_PASSWORD,
} from './types';

export const getCompanyInfo = (token) => ({
  type: GET_INFO,
  request: {
    method: 'GET',
    url: `/find/${token}`,
  },
  meta: {
    thunk: true,
  },
});

export const confirmPassword = ({
  token, password, email, password_confirmation,
}) => ({
  type: CONFIRM_PASSWORD,
  request: {
    method: 'POST',
    url: `/password_confirmation/${token}`,
  },
  data: {
    email, password, password_confirmation,
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
    },
  },
  meta: {
    thunk: true,
  },
});

export const setNewPassword = (email, password) => ({
  type: SET_NEW_PASSWORD,
  request: {
    method: 'POST',
    url: '/password/reset',
    data: {
      email,
      password,
    },
  },
  meta: {
    thunk: true,
  },
});
