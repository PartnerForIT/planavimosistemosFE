import {
  GET_SCHEDULE,
  GET_SCHEDULE_SUCCESS,
  GET_SCHEDULE_ERROR,
  POST_SHIFT,
  POST_SHIFT_SUCCESS,
  POST_SHIFT_ERROR,
  GET_SHIFT,
  GET_SHIFT_SUCCESS,
  GET_SHIFT_ERROR,
  PUT_SHIFT,
  PUT_SHIFT_SUCCESS,
  PUT_SHIFT_ERROR,
  RESET_SHIFT,
  PATCH_CHANGE_EMPLOYEE,
  PATCH_CHANGE_TIMELINE,
  DELETE_TIMELINE,
  DELETE_SHIFT,
} from './types';

export const getSchedule = ({
  companyId,
  timeline,
  fromDate,
  firstLoading,
}) => ({
  type: GET_SCHEDULE,
  companyId,
  timeline,
  fromDate,
  firstLoading,
});
export const getScheduleSuccess = (data) => ({
  type: GET_SCHEDULE_SUCCESS,
  data,
});
export const getScheduleError = () => ({
  type: GET_SCHEDULE_ERROR,
});

export const postShift = ({ companyId, data }) => ({
  type: POST_SHIFT,
  companyId,
  data,
});
export const postShiftSuccess = () => ({
  type: POST_SHIFT_SUCCESS,
});
export const postShiftError = () => ({
  type: POST_SHIFT_ERROR,
});

export const getShift = ({ companyId, shiftId }) => ({
  type: GET_SHIFT,
  companyId,
  shiftId,
});
export const getShiftSuccess = (data) => ({
  type: GET_SHIFT_SUCCESS,
  data,
});
export const getShiftError = () => ({
  type: GET_SHIFT_ERROR,
});

export const putShift = ({ companyId, data, id }) => ({
  type: PUT_SHIFT,
  companyId,
  data,
  id,
});
export const putShiftSuccess = (data) => ({
  type: PUT_SHIFT_SUCCESS,
  data,
});
export const putShiftError = () => ({
  type: PUT_SHIFT_ERROR,
});

export const patchChangeEmployee = ({
  companyId,
  shiftId,
  data,
  id,
  body,
}) => ({
  type: PATCH_CHANGE_EMPLOYEE,
  companyId,
  shiftId,
  data,
  id,
  body,
});
export const patchChangeTimeline = ({
  companyId,
  shiftId,
  data,
  id,
  body,
}) => ({
  type: PATCH_CHANGE_TIMELINE,
  companyId,
  shiftId,
  data,
  id,
  body,
});
export const deleteTimeline = ({
  companyId,
  data,
  shiftId,
  id,
  body,
}) => ({
  type: DELETE_TIMELINE,
  companyId,
  shiftId,
  data,
  id,
  body,
});
export const deleteShift = ({ companyId, id, body }) => ({
  type: DELETE_SHIFT,
  companyId,
  id,
  body,
});

export const resetShift = () => ({
  type: RESET_SHIFT,
});
