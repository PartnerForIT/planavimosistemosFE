import {
  GET_REPORT,
  EXCEL,
  PDF,
} from './types';

export const getReport = (companyId, data) => ({
  type: GET_REPORT,
  request: {
    method: 'POST',
    url: `/company/${companyId}/reports/generate`,
    data: {
      ...data,
    },
  },
  meta: {
    thunk: true,
  },
});

export const downloadExcel = (companyId, queryObj) => ({
  type: EXCEL,
  request: {
    method: 'GET',
    url: `/company/${companyId}/reports/export/excel`,
    params: {
      ...queryObj,
    },
    responseType: 'application/json',
  },
  meta: {
    thunk: true,
  },
});

export const downloadPdf = (companyId, queryObj) => ({
  type: PDF,
  request: {
    method: 'GET',
    url: `/company/${companyId}/reports/export/pdf`,
    params: {
      ...queryObj,
    },
    responseType: 'application/json',
  },
  meta: {
    thunk: true,
  },
});
