import {
  GET_COUNTRIES,
  GET_COUNTRIES_SUCCESS,
  GET_COUNTRIES_ERROR,
  POST_ORGANIZATION,
  POST_ORGANIZATION_SUCCESS,
  ADD_SNACKBAR,
  DISMISS_SNACKBAR,
  GET_COMPANIES,
  GET_COMPANIES_SUCCESS,
  POST_CHANGE_OF_STATUS,
  GET_MODULES,
  GET_MODULES_SUCCESS,
  PATCH_MODULES,
  PATCH_MODULES_SUCCESS,
} from './types';

export const getCountries = () => ({
  type: GET_COUNTRIES,
});
export const getCountriesSuccess = (data) => ({
  type: GET_COUNTRIES_SUCCESS,
  data,
});
export const getCountriesError = (data) => ({
  type: GET_COUNTRIES_ERROR,
  data,
});

export const addOrganization = (data) => ({
  type: POST_ORGANIZATION,
  data,
});
export const addOrganizationSuccess = (data) => ({
  type: POST_ORGANIZATION_SUCCESS,
  data,
});

export const addSnackbar = (data, snackbarType) => ({
  type: ADD_SNACKBAR,
  data,
  snackbarType,
});
export const dismissSnackbar = () => ({ type: DISMISS_SNACKBAR });

export const getCompanies = (params) => ({
  type: GET_COMPANIES,
  params,
});
export const getCompaniesSuccess = (data) => ({
  type: GET_COMPANIES_SUCCESS,
  data,
});

export const postChangeOfStatus = (data) => ({
  type: POST_CHANGE_OF_STATUS,
  data,
});

export const getModules = (params) => ({
  type: GET_MODULES,
  params,
});

export const getModulesSuccess = (data) => ({
  type: GET_MODULES_SUCCESS,
  data,
});

export const patchModules = (id, data) => ({
  type: PATCH_MODULES,
  id,
  data,
});
export const patchModulesSuccess = (data) => ({
  type: PATCH_MODULES_SUCCESS,
  data,
});
