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
  GET_COMPANIES_ERROR,
  POST_CHANGE_OF_STATUS,
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
})

export const addSnackbar = (data, snackbarType) => ({
  type: ADD_SNACKBAR,
  data,
  snackbarType,
});
export const dismissSnackbar = () => ({ type: DISMISS_SNACKBAR });

export const getCompanies = (params) => ({
  type: GET_COMPANIES,
  params
})
export const getCompaniesSuccess = (data) => ({
  type: GET_COMPANIES_SUCCESS,
  data
})

export const postChangeOfStatus = (data) => ({
  type: POST_CHANGE_OF_STATUS,
  data
})