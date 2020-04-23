import { makeQueryString } from '../../components/Helpers';
import {
  GET_WORK_TIME,
  GET_BREAK_TIME,
  DELETE_ITEMS,
} from './types';

export const getWorkTime = (queryObj) => ({
  type: GET_WORK_TIME,
  request: {
    method: 'GET',
    url: `/logbook?${makeQueryString(queryObj)}`,
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

export const removeItems = (queryObj) => ({
  type: DELETE_ITEMS,
  request: {
    method: 'DELETE',
    url: `/logbook?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});
