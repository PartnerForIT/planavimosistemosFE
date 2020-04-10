import { makeQueryString } from '../../components/Helpers';
import {
  GET_REPORT,
  GET_BREAK_TIME,
} from './types';

export const getReport = (startDate, endDate) => ({
  type: GET_REPORT,
  request: {
    method: 'POST',
    url: '/reports/generate',
  },
  data: {
    startDate, endDate,
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
