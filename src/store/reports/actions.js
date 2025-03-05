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

export const downloadExcel = (companyId, data, source) => ({
  type: EXCEL,
  request: {
    method: 'POST',
    url: `/company/${companyId}/${source}/export/excel`,
    data: {
      ...data,
    },
    responseType: 'application/json',
  },
  meta: {
    thunk: true,
  },
});

export const downloadRupExcel = (companyId, data, source) => ({
  type: EXCEL,
  request: {
    method: 'POST',
    url: `/company/${companyId}/${source}/export/excel-rup`,
    data: {
      ...data,
    },
    responseType: 'application/json',
  },
  meta: {
    thunk: true,
  },
});

export const downloadPdf = (companyId, data,source) => ({
  type: PDF,
  request: {
    method: 'POST',
    url: `/company/${companyId}/${source}/export/pdf`,
    data: {
      ...data,
    },
    responseType: 'application/json',
  },
  meta: {
    thunk: true,
  },
});
