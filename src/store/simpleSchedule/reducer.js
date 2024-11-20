import {
  GET_SIMPLE_SCHEDULE,
  GET_SIMPLE_SCHEDULE_SUCCESS,
  GET_SIMPLE_SCHEDULE_ERROR,
  POST_SIMPLE_SHEET,
  POST_SIMPLE_SHEET_SUCCESS,
  POST_SIMPLE_SHEET_ERROR,

} from './types';

const initialState = {
  schedule: null,
  resources: null,
  events: null,
  loading: false,
  markers: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_SIMPLE_SHEET:
    case GET_SIMPLE_SCHEDULE:
      return { ...state, loading: true };
    case GET_SIMPLE_SCHEDULE_SUCCESS:
      return {
        ...state,
        schedule: action.data,
        loading: false,
      };
    case GET_SIMPLE_SCHEDULE_ERROR:
      return { ...state, loading: false };
    case POST_SIMPLE_SHEET_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case POST_SIMPLE_SHEET_ERROR:
      return { ...state, loading: false };

    default: return state;
  }
};

export default reducer;
