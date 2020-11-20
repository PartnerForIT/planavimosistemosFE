import {
  GET_SETTINGS_COMPANY,
  GET_SETTINGS_COMPANY_SUCCESS,
  PATCH_SETTINGS_COMPANY,
  PATCH_SETTINGS_COMPANY_SUCCESS,
  ADD_SETTING_SNACKBAR,
  DISMISS_SETTING_SNACKBAR,
  GET_WORK_TIME,
  GET_WORK_TIME_SUCCESS
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
  type: ADD_SETTING_SNACKBAR,
  data,
  snackbarType,
});
export const dismissSnackbar = () => ({ type: DISMISS_SETTING_SNACKBAR });

export const getSettingWorkTime = (id) => ({
  type: GET_WORK_TIME,
  id
});
export const getSettingWorkTimeSuccess = (data) => ({
  type: GET_WORK_TIME_SUCCESS,
  data
});