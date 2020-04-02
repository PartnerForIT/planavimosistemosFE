import {
  GET_EMPLOYEE,
  GET_EMPLOYEES,
} from './types';

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
    url: '/employee/',
  },
  meta: {
    thunk: true,
  },
});
