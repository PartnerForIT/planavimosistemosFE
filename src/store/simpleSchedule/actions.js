import {
  GET_SIMPLE_SCHEDULE,
  GET_SIMPLE_SCHEDULE_SUCCESS,
  GET_SIMPLE_SCHEDULE_ERROR,
  POST_SIMPLE_SHEET,
  POST_SIMPLE_SHEET_SUCCESS,
  POST_SIMPLE_SHEET_ERROR,
} from './types';
import getToken from '../getToken';
import config from 'config';

export const getSchedule = (data) => {
  return (dispatch, getState) => {
    dispatch(getSimpleScheduleAction());
    return new Promise((resolve, reject) => {
      const sendData = {
        skills: '',
        employeesArr: '',
        timeline: '',
        fromDate: '',
        ...data,
      };
      fetch(`${config.api.url}/company/${data.companyId}/simple?type=${sendData.timeline}&from_date=${sendData.fromDate}&skills=${sendData.skills}&employeesArr=${sendData.employeesArr}`, {
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
        dispatch(getSimpleScheduleSuccess(data));
        resolve(data);
      })
      .catch(error => {
        dispatch(getSimpleScheduleError());
        reject(error);
      });
    });
  };
};
    

export const postShift = ({ companyId, data }) => {
  return (dispatch, getState) => {
    dispatch(postSimpleSheet());
    return new Promise((resolve, reject) => {
      fetch(`${config.api.url}/company/${companyId}/simple/store`, {
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
        dispatch(postSimpleSheetSuccess(data));
        resolve(data);
      })
      .catch(error => {
        dispatch(postSimpleSheetError());
        reject(error);
      });
    });
  };
};

export const postSimpleSheet = (data) => ({
  type: POST_SIMPLE_SHEET,
  data,
});

export const postSimpleSheetSuccess = (data) => ({
  type: POST_SIMPLE_SHEET_SUCCESS,
  data,
});
export const postSimpleSheetError = () => ({
  type: POST_SIMPLE_SHEET_ERROR,
});

export const getSimpleScheduleAction = (data) => ({
  type: GET_SIMPLE_SCHEDULE,
  data,
});

export const getSimpleScheduleSuccess = (data) => ({
  type: GET_SIMPLE_SCHEDULE_SUCCESS,
  data,
});

export const getSimpleScheduleError = () => ({
  type: GET_SIMPLE_SCHEDULE_ERROR,
});