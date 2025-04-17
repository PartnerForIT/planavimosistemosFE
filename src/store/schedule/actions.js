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
  PATCH_MARKER,
  PATCH_MARKER_SUCCESS,
  PATCH_MARKER_ERROR,
  PATCH_GENERATE_TIMES,
  PATCH_CLEAR_TIMES,
  PATCH_CHANGE_EMPLOYEE,
  PATCH_CHANGE_TIMELINE,
  PATCH_ADD_TIMELINE,
  DELETE_TIMELINE,
  EMPTY_TIMELINE,
  DELETE_SHIFT,
  ADD_TEMP_EMPLOYEE,
  ADD_TEMP_EMPLOYEE_SUCCESS,
  SET_LOADER,
  DOWNLOAD_SCHEDULE,
  
} from './types';

export const getSchedule = ({
  companyId,
  shiftTypeArr = '',
  employeesArr = '',
  placesArr = '',
  timeline,
  fromDate,
  firstLoading,
}) => ({
  type: GET_SCHEDULE,
  companyId,
  shiftTypeArr,
  employeesArr,
  placesArr,
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

export const addTempemployee = ({companyId,data,shiftId,body})=>({
  type:ADD_TEMP_EMPLOYEE,
  companyId,
  data,
  shiftId,
  body
})

export const addTempemployeeSuccess = (data) => ({
  type:ADD_TEMP_EMPLOYEE_SUCCESS,
  data
})
export const postShiftSuccess = () => ({
  type: POST_SHIFT_SUCCESS,
});
export const postShiftError = () => ({
  type: POST_SHIFT_ERROR,
});
export const setLoader = () => ({
  type: SET_LOADER,
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
export const patchMarker= ({
  companyId,
  data,
}) => ({
  type: PATCH_MARKER,
  companyId,
  data,
});
export const patchMarkerSuccess = (data) => ({
  type: PATCH_MARKER_SUCCESS,
  data,
});
export const patchMarkerError = () => ({
  type: PATCH_MARKER_ERROR,
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
export const patchGenerateTimes = ({
  companyId,
  shiftId,
  data,
  body,
}) => ({
  type: PATCH_GENERATE_TIMES,
  companyId,
  shiftId,
  data,
  body,
});
export const patchClearTimes = ({
  companyId,
  shiftId,
  data,
  body,
}) => ({
  type: PATCH_CLEAR_TIMES,
  companyId,
  shiftId,
  data,
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
export const patchAddTimeline = ({
  companyId,
  shiftId,
  data,
  id,
  body,
}) => ({
  type: PATCH_ADD_TIMELINE,
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
export const emptyTimeline = ({
  companyId,
  data,
  shiftId,
  id,
  body,
}) => ({
  type: EMPTY_TIMELINE,
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

export const downloadSchedule = (companyId, fromDate, type, data) => ({
  type: DOWNLOAD_SCHEDULE,
  request: {
    method: 'POST',
    url: `/company/${companyId}/shift/download?type=${type}&from_date=${fromDate}`,
    data: {
      ...data,
    },
    responseType: 'application/json',
  },
  meta: {
    thunk: true,
  },
});