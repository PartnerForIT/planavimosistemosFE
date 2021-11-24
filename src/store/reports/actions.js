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

export const downloadExcel = (companyId, data) => ({
  type: EXCEL,
  request: {
    method: 'POST',
    url: `/company/${companyId}/reports/export/excel`,
    params: {
      ...data,
    },
    responseType: 'application/json',
  },
  meta: {
    thunk: true,
  },
});

export const downloadPdf = (companyId, data) => ({
  type: PDF,
  request: {
    method: 'POST',
    url: `/company/${companyId}/reports/export/pdf`,
    data: {
      ...data,
    },
    responseType: 'application/json',
  },
  meta: {
    thunk: true,
  },
});
