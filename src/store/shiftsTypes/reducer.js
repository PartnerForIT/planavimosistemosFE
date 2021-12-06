import { success, error } from 'redux-saga-requests';
import {
  GET_SHIFT_TYPES,
} from './types';

const initialState = {
  shiftTypes: [],
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SHIFT_TYPES:
      return { ...state, error: null, loading: true };

    case success(GET_SHIFT_TYPES):
      return {
        ...state,
        shiftTypes: action.data.shifts,
        loading: false,
      };

    case error(GET_SHIFT_TYPES):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
