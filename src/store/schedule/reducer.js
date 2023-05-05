import { success, error } from 'redux-saga-requests';
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
  DELETE_SHIFT,
  PATCH_MARKER,
  PATCH_MARKER_SUCCESS,
  PATCH_MARKER_ERROR,
  PATCH_CHANGE_EMPLOYEE,
  PATCH_CHANGE_TIMELINE,
  PATCH_ADD_TIMELINE,
  DOWNLOAD_SCHEDULE,
  DOWNLOAD_SCHEDULE_SUCCESS,
  DOWNLOAD_SCHEDULE_ERROR,
  DELETE_TIMELINE, EMPTY_TIMELINE, ADD_TEMP_EMPLOYEE, ADD_TEMP_EMPLOYEE_SUCCESS,
} from './types';
import {ADD_SNACKBAR} from "../organizationList/types";

const initialState = {
  schedule: null,
  resources: null,
  events: null,
  loading: false,
  shift: null,
  markers: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULE:
      return { ...state, loading: true };
    case success(GET_SCHEDULE):
      return {
        ...state,
        schedule: action.data,
        resources: action.data.resources,
        events: action.data.events,
        markers: action.data.markers,
        loading: false,
      };
    case GET_SCHEDULE_ERROR:
      return { ...state, loading: false };

    case POST_SHIFT:
    case PUT_SHIFT:
      return { ...state, postShiftLoading: true };
    case POST_SHIFT_SUCCESS:
    case PUT_SHIFT_SUCCESS:
      return { ...state, postShiftLoading: false };
    case POST_SHIFT_ERROR:
    case PUT_SHIFT_ERROR:
      return { ...state, postShiftLoading: false };

    case GET_SHIFT:
    case DELETE_SHIFT:
    case PATCH_MARKER:
    case PATCH_CHANGE_EMPLOYEE:
    case PATCH_CHANGE_TIMELINE:
    case PATCH_ADD_TIMELINE:
    case DELETE_TIMELINE:
      return {
        ...state,
        loading: true,
      };
    case EMPTY_TIMELINE:
      return {
        ...state,
        loading: true,
      };
    case PATCH_MARKER_SUCCESS:
      return { ...state, markers: action.data, loading: false };
    case PATCH_MARKER_ERROR:
      return { ...state, loading: false };
    case GET_SHIFT_SUCCESS:
      return { ...state, shift: action.data, loading: false };
    case GET_SHIFT_ERROR:
      return { ...state, loading: false };

    case RESET_SHIFT:
      return { ...state, shift: null };

    case DOWNLOAD_SCHEDULE:
      return { ...state, loading: true };
    case success(DOWNLOAD_SCHEDULE):
      return {
        ...state,
        //data: action.data,
        loading: false,
      };
    case DOWNLOAD_SCHEDULE_ERROR:
      return { ...state, loading: false };

    case ADD_TEMP_EMPLOYEE:
      return {...state}
    // case ADD_TEMP_EMPLOYEE_SUCCESS:
    //   return {...state}
    case ADD_SNACKBAR:
      return {
        ...state,
       loading: false
      };

    default: return state;
  }
};

export default reducer;
