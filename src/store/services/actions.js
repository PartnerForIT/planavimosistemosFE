/* eslint-disable camelcase */
import {
  GET_INFO, CONFIRM_PASSWORD, CLEAR_SERVICES,
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
