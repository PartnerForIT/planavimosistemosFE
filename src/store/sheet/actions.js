import {
  //GET_SHEET,
  GET_SHEET_SUCCESS,
  GET_SHEET_ERROR,

  GET_INTEGRATION,
  GET_INTEGRATION_SUCCESS,
  GET_INTEGRATION_ERROR,

} from './types';
import getToken from '../getToken';
import config from 'config';

export const checkIntegration = (companyId, file) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      fetch(`${config.api.url}/company/${companyId}/sheet/integration/check?file=${file}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getToken().headers,
        },
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
    });
  };
};

export const getSheet = ({ companyId, data, fromDate }) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      fetch(`${config.api.url}/company/${companyId}/sheet?from_date=${fromDate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getToken().headers,
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
      })
      .then(data => {
        dispatch(getSheetSuccess(data));
        resolve(data);
      })
      .catch(error => {
        dispatch(getSheetError());
        reject(error);
      });
    });
  };
};

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