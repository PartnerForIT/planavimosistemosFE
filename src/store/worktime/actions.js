import {
  GET_WORK_TIME,
  GET_BREAK_TIME,
} from './types';

const makeQueryString = (queryObj) => Object.keys(queryObj)
  .filter((item) => typeof queryObj[item] !== 'undefined' && queryObj[item].toString().length)
  .map((key) => `${key}=${queryObj[key]}`).join('&');

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
