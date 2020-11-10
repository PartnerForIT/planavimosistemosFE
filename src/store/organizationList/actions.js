import {
  GET_COUNTRIES,
  GET_COUNTRIES_SUCCESS,
  GET_COUNTRIES_ERROR
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