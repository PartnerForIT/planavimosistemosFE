import {
  GET_SHIFT,
  GET_SHIFT_SUCCESS,
  GET_SHIFT_ERROR,
} from './types';

export const getShift = ({ companyId, timeline }) => ({
  type: GET_SHIFT,
  companyId,
  timeline,
});

export const getShiftSuccess = (data) => ({
  type: GET_SHIFT_SUCCESS,
  data,
});

export const getShiftError = () => ({
  type: GET_SHIFT_ERROR,
});
