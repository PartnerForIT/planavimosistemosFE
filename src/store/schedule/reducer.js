import { success } from 'redux-saga-requests';
import {
  GET_SCHEDULE,
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
  SET_LOADER,
  SET_ACTIVE_DEMAND_ID,
  
  DOWNLOAD_SCHEDULE_ERROR,
  DELETE_TIMELINE, EMPTY_TIMELINE, ADD_TEMP_EMPLOYEE,
} from './types';
import {ADD_SNACKBAR} from "../organizationList/types";

const initialState = {
  schedule: null,
  resources: null,
  events: null,
  loading: false,
  shift: null,
  markers: [],
  published: false,
  count_changes: 0,
  activeDemandId: null,
  aiEventGeneration: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADER:
      return {
        ...state,
        loading: true };
    case GET_SCHEDULE:
      return {
        ...state,
        schedule: state.schedule ? {...state.schedule, events: []} : null,
        events: null,
        loading: true };
    case success(GET_SCHEDULE):
      return {
        ...state,
        schedule: action.data,
        resources: action.data.resources,
        events: action.data.events,
        markers: action.data.markers,
        published: action.data.published,
        count_changes: action.data.count_changes,
        loading: false,
      };
    case GET_SCHEDULE_ERROR:
      return { ...state, loading: false };
    case 'SET_AI_EVENT_GENERATION':
      return { ...state, aiEventGeneration: action.payload };
    case SET_ACTIVE_DEMAND_ID:
      return { ...state, activeDemandId: state.activeDemandId === action.id ? null : action.id };
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
