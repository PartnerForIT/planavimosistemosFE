import {
  GET_SETTINGS_COMPANY,
  GET_SETTINGS_COMPANY_SUCCESS,
  PATCH_SETTINGS_COMPANY,
  PATCH_SETTINGS_COMPANY_SUCCESS,
  ADD_SETTING_SNACKBAR,
  DISMISS_SETTING_SNACKBAR,
  GET_WORK_TIME,
  GET_WORK_TIME_SUCCESS,
  PATCH_WORK_TIME,
  ADD_HOLIDAY,
  ADD_HOLIDAY_SUCCESS,
  DELETE_HOLIDAY,
  DELETE_HOLIDAY_SUCCESS,
  GET_SECURITY_COMPANY,
  GET_SECURITY_COMPANY_SUCCESS,
  PATCH_SECURITY_COMPANY,
  PATCH_SECURITY_COMPANY_SUCCESS,
  GET_SKILLS,
  GET_SKILLS_SUCCESS,
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

export const patchWorkTime = (data, id) => ({
  type: PATCH_WORK_TIME,
  data,
  id
});

export const addHoliday = (data, id) => ({
  type: ADD_HOLIDAY,
  data,
  id
});
export const addHolidaySuccess = (data) => ({
  type: ADD_HOLIDAY_SUCCESS,
  data
});

export const deleteHoliday = (id, companyId) => ({
  type: DELETE_HOLIDAY,
  id,
  companyId
});
export const deleteHolidaySuccess = (id) => ({
  type: DELETE_HOLIDAY_SUCCESS,
  id,
});

export const getSecurityCompany = (id) => ({
  type: GET_SECURITY_COMPANY,
  id
});
export const getSecurityCompanySuccess = (data) => ({
  type: GET_SECURITY_COMPANY_SUCCESS,
  data
});

export const editSecurityPage = (data, id) => ({
  type: PATCH_SECURITY_COMPANY,
  data,
  id,
});
export const editSecurityPageSuccess = (data) => ({
  type: PATCH_SECURITY_COMPANY_SUCCESS,
  data
});

export const loadSkills = (id) => ({
  type: GET_SKILLS,
  id
});
export const loadSkillsSuccess = (data) => ({
  type: GET_SKILLS_SUCCESS,
  data
});

