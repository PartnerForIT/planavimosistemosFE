import {
  GET_EMPLOYEE,
  GET_EMPLOYEES,
} from './types';
import { makeQueryString } from '../../components/Helpers';

export const getEmployee = (id) => ({
  type: GET_EMPLOYEE,
  request: {
    method: 'GET',
    url: `/employee/${id}`,
  },
  meta: {
    thunk: true,
  },
});

export const getEmployees = (companyId) => ({
  type: GET_EMPLOYEES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/employees`,
  },
  meta: {
    thunk: true,
  },
});

export const getReportsEmployees = (queryObj) => ({
  type: GET_EMPLOYEES,
  request: {
    method: 'GET',
    url: `/reports/employees?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});
