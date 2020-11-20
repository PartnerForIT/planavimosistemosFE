import {
  GET_SETTINGS_COMPANY,
  GET_SETTINGS_COMPANY_SUCCESS,
  PATCH_SETTINGS_COMPANY,
  PATCH_SETTINGS_COMPANY_SUCCESS,
  ADD_SNACKBAR,
  DISMISS_SNACKBAR
} from './types';

export const getSettingCompany = (id) => ({
  type: GET_SETTINGS_COMPANY,
  id
});
export const getSettingCompanySuccess = (data) => ({
  type: GET_SETTINGS_COMPANY_SUCCESS,
  data
});

export const editSettingCompany = (data, id) => ({
  type: PATCH_SETTINGS_COMPANY,
  data,
  id
});
export const editSettingCompanySuccess = (data) => ({
  type: PATCH_SETTINGS_COMPANY_SUCCESS,
  data
});

export const addSnackbar = (data, snackbarType) => ({
  type: ADD_SNACKBAR,
  data,
  snackbarType,
});
export const dismissSnackbar = () => ({ type: DISMISS_SNACKBAR });