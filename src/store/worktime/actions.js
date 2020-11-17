import { makeQueryString } from '../../components/Helpers';
import {
  GET_WORK_TIME,
  GET_BREAK_TIME,
  DELETE_ITEMS,
} from './types';

export const getWorkTime = (queryObj, companyId) => ({
  type: GET_WORK_TIME,
  request: {
    method: 'GET',
    url: `/company/${companyId}/logbook?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});

export const getBreakTime = (queryObj, companyId) => ({
  type: GET_BREAK_TIME,
  request: {
    method: 'GET',
    url: `/logbook?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});

export const removeItems = (queryObj, companyId) => ({
  type: DELETE_ITEMS,
  request: {
    method: 'DELETE',
    url: `/logbook?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});
