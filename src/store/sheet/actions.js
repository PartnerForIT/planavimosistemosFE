import {
  GET_SHEET,
  GET_SHEET_SUCCESS,
  GET_SHEET_ERROR,

  GET_INTEGRATION,
  GET_INTEGRATION_SUCCESS,
  GET_INTEGRATION_ERROR,

} from './types';

export const getSheet = ({
  companyId,
  fromDate,
  firstLoading,
}) => ({
  type: GET_SHEET,
  companyId,
  fromDate,
  firstLoading,
});
export const getSheetSuccess = (data) => ({
  type: GET_SHEET_SUCCESS,
  data,
});
export const getSheetError = () => ({
  type: GET_SHEET_ERROR,
});
export const downloadIntegration = (companyId, fromDate, data) => ({
  type: GET_INTEGRATION,
  request: {
    method: 'POST',
    url: `/company/${companyId}/sheet/integration?from_date=${fromDate}`,
    data: {
      ...data,
    },
    responseType: 'application/json',
  },
  meta: {
    thunk: true,
  },
});

/*
export const getIntegration = ({
  companyId,
  fromDate,
  data,
}) => ({
  type: GET_INTEGRATION,
  companyId,
  fromDate,
  data,
});
*/
export const getIntegrationSuccess = (data) => ({
  type: GET_INTEGRATION_SUCCESS,
  data,
});
export const getIntegrationError = () => ({
  type: GET_INTEGRATION_ERROR,
});