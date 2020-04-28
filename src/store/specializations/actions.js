import {
  GET_SPECIALIZATIONS,
} from './types';
import { makeQueryString } from '../../components/Helpers';

export const getSpecializations = () => ({
  type: GET_SPECIALIZATIONS,
  request: {
    method: 'GET',
    url: '/jobtypes',
  },
  meta: {
    thunk: true,
  },
});

export const getReportsSpecializations = (queryObj) => ({
  type: GET_SPECIALIZATIONS,
  request: {
    method: 'GET',
    url: `/reports/jobtypes?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});

export const getSpecialization = () => ({
  type: GET_SPECIALIZATIONS,
  request: {
    method: 'GET',
    url: '/jobtype',
  },
  meta: {
    thunk: true,
  },
});
