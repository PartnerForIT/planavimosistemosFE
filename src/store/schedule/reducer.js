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
} from './types';

const initialState = {
  schedule: null,
  resources: null,
  events: null,
  loading: false,
  shift: null,
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
      return { ...state, loading: true };
    case GET_SHIFT_SUCCESS:
      return { ...state, shift: action.data, loading: false };
    case GET_SHIFT_ERROR:
      return { ...state, loading: false };

    case RESET_SHIFT:
      return { ...state, shift: null };

    default: return state;
  }
};

export default reducer;