import { makeQueryString } from '../../components/Helpers';
import {
  GET_REPORT,
  EXCEL,
  PDF,
} from './types';

export const getReport = (startDate, endDate, jobTypes, employees, places, skills) => ({
  type: GET_REPORT,
  request: {
    method: 'POST',
    url: '/reports/generate',
    data: {
      startDate, endDate, jobTypes, employees, places, skills,
    },
  },
  meta: {
    thunk: true,
  },
});

export const downloadExcel = (queryObj) => ({
  type: EXCEL,
  request: {
    method: 'GET',
    url: `/reports/export/excel?${makeQueryString(queryObj, false)}`,
    responseType: 'blob',
  },
  meta: {
    thunk: true,
  },
});

export const downloadPdf = (queryObj) => ({
  type: PDF,
  request: {
    method: 'GET',
    url: `/reports/export/pdf?${makeQueryString(queryObj, false)}`,
    responseType: 'blob',
  },
  meta: {
    thunk: true,
  },
});
