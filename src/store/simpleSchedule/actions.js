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
    dispatch(getScheduleAction());
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
        dispatch(getScheduleSuccess(data));
        resolve(data);
      })
      .catch(error => {
        dispatch(getScheduleError());
        reject(error);
      });
    });
  };
};
    

export const postShift = ({ companyId, data }) => {
  return (dispatch, getState) => {
    dispatch(postSheet());
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
        dispatch(postSheetSuccess(data));
        resolve(data);
      })
      .catch(error => {
        dispatch(postSheetError());
        reject(error);
      });
    });
  };
};

export const postSheet = (data) => ({
  type: POST_SIMPLE_SHEET,
  data,
});

export const postSheetSuccess = (data) => ({
  type: POST_SIMPLE_SHEET_SUCCESS,
  data,
});
export const postSheetError = () => ({
  type: POST_SIMPLE_SHEET_ERROR,
});

export const getScheduleAction = (data) => ({
  type: GET_SIMPLE_SCHEDULE,
  data,
});

export const getScheduleSuccess = (data) => ({
  type: GET_SIMPLE_SCHEDULE_SUCCESS,
  data,
});

export const getScheduleError = () => ({
  type: GET_SIMPLE_SCHEDULE_ERROR,
});