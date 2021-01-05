import { makeQueryString } from '../../components/Helpers';
import {
  GET_REPORT,
  EXCEL,
  PDF,
} from './types';

export const getReport = (startDate, endDate, jobTypes, employees, places, skills, companyId) => ({
  type: GET_REPORT,
  request: {
    method: 'POST',
    url: `/company/${companyId}/reports/generate`,
    data: {
      startDate, endDate, jobTypes, employees, places, skills,
    },
  },
  meta: {
    thunk: true,
  },
});

export const downloadExcel = (queryObj, companyId) => ({
  type: EXCEL,
  request: {
    method: 'GET',
    url: `/company/${companyId}/reports/export/excel?${makeQueryString(queryObj, false)}`,
    responseType: 'blob',
  },
  meta: {
    thunk: true,
  },
});

export const downloadPdf = (queryObj, companyId) => ({
  type: PDF,
  request: {
    method: 'GET',
    url: `/company/${companyId}/reports/export/pdf?${makeQueryString(queryObj, false)}`,
    responseType: 'blob',
  },
  meta: {
    thunk: true,
  },
});
