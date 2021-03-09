import {
  GET_JOB_TYPES,
} from './types';
import { makeQueryString } from '../../components/Helpers';

export const getJobTypes = (companyId) => ({
  type: GET_JOB_TYPES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/job-types`,
  },
  meta: {
    thunk: true,
  },
});

export const getReportsJobTypes = ({ companyId, ...rest }) => ({
  type: GET_JOB_TYPES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/reports/jobtypes?${makeQueryString(rest)}`,
  },
  meta: {
    thunk: true,
  },
});
