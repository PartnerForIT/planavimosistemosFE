import {
  GET_COUNTRIES,
  GET_COUNTRIES_SUCCESS,
  GET_COUNTRIES_ERROR,
  POST_ORGANIZATION,
  ADD_SNACKBAR,
  DISMISS_SNACKBAR,
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

export const addSnackbar = (data, snackbarType) => ({
  type: ADD_SNACKBAR,
  data,
  snackbarType,
});

export const dismissSnackbar = () => ({ type: DISMISS_SNACKBAR });