import { makeQueryString } from '../../components/Helpers';
import {
  GET_REPORT,
  GET_FILTERS,
  EXCEL,
  PDF,
} from './types';

export const getReport = (startDate, endDate, specializations, employees, places) => ({
  type: GET_REPORT,
  request: {
    method: 'POST',
    url: '/reports/generate',
    data: {
      startDate, endDate, specializations, employees, places,
    },
  },
  meta: {
    thunk: true,
  },
});

export const getFilters = (queryObj) => ({
  type: GET_FILTERS,
  request: {
    method: 'GET',
    url: `/reports/filters?${makeQueryString(queryObj)}`,
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
