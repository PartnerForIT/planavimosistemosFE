import {
  GET_SETTINGS_COMPANY,
  GET_SETTINGS_COMPANY_SUCCESS
} from './types';

export const getSettingCompany = (id) => ({
  type: GET_SETTINGS_COMPANY,
  id
});
export const getSettingCompanySuccess = (data) => ({
  type: GET_SETTINGS_COMPANY_SUCCESS,
  data
});