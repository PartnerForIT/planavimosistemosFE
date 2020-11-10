import {
  GET_JOB_TYPES,
} from './types';
import { makeQueryString } from '../../components/Helpers';

export const getJobTypes = (companyId) => ({
  type: GET_JOB_TYPES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/jobtypes`,
  },
  meta: {
    thunk: true,
  },
});

export const getReportsJobTypes = (queryObj) => ({
  type: GET_JOB_TYPES,
  request: {
    method: 'GET',
    url: `/reports/jobtypes?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});
