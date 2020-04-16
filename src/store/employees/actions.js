import {
  GET_EMPLOYEE,
  GET_EMPLOYEES,
} from './types';
import { makeQueryString } from '../../components/Helpers';

export const getEmployee = (worktimeId) => ({
  type: GET_EMPLOYEE,
  request: {
    method: 'GET',
    url: `/employee/${worktimeId}`,
  },
  meta: {
    thunk: true,
  },
});

export const getEmployees = () => ({
  type: GET_EMPLOYEES,
  request: {
    method: 'GET',
    url: '/employees',
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
