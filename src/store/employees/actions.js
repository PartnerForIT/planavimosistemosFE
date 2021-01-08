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

export const getReportsEmployees = ({ companyId, ...rest }) => ({
  type: GET_EMPLOYEES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/reports/employees?${makeQueryString(rest)}`,
  },
  meta: {
    thunk: true,
  },
});
