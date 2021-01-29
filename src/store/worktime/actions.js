import { makeQueryString } from '../../components/Helpers';
import {
  GET_WORK_TIME,
  GET_BREAK_TIME,
  DELETE_ITEMS, CHANGE_STATUS_ITEMS,
} from './types';

export const getWorkTime = (companyId, queryObj) => ({
  type: GET_WORK_TIME,
  request: {
    method: 'GET',
    url: `/company/${companyId}/logbook?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});

export const getBreakTime = (queryObj) => ({
  type: GET_BREAK_TIME,
  request: {
    method: 'GET',
    url: `/logbook?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});

export const removeItems = (companyId, queryObj) => ({
  type: DELETE_ITEMS,
  request: {
    method: 'DELETE',
    url: `/company/${companyId}/logbook?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});

export const changeStatusItems = (companyId, queryObj) => ({
  type: CHANGE_STATUS_ITEMS,
  request: {
    method: 'PATCH',
    url: `/company/${companyId}/logbook/status?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});
