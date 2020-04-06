import { success, error } from 'redux-saga-requests';
import {
  GET_SPECIALIZATIONS,
} from './types';

const initialState = {
  specializations: [],
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPECIALIZATIONS:
      return { ...state, error: null, loading: true };

    case success(GET_SPECIALIZATIONS):
      return {
        ...state,
        specializations: action.data,
        loading: false,
      };

    case error(GET_SPECIALIZATIONS):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
