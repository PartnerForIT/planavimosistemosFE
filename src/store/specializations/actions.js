import {
  GET_SPECIALIZATIONS,
} from './types';
import { makeQueryString } from '../../components/Helpers';

export const getSpecializations = () => ({
  type: GET_SPECIALIZATIONS,
  request: {
    method: 'GET',
    url: '/specializations',
  },
  meta: {
    thunk: true,
  },
});

export const getReportsSpecializations = (queryObj) => ({
  type: GET_SPECIALIZATIONS,
  request: {
    method: 'GET',
    url: `/reports/specializations?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});

export const getSpecialization = () => ({
  type: GET_SPECIALIZATIONS,
  request: {
    method: 'GET',
    url: '/specialization',
  },
  meta: {
    thunk: true,
  },
});
