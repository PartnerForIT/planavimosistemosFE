import { success, error } from 'redux-saga-requests';
import {
  GET_PLACES,
} from './types';

const initialState = {
  places: [],
  place: null,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PLACES:
      return { ...state, error: null, loading: true };

    case success(GET_PLACES):
      return {
        ...state,
        places: action.data,
        loading: false,
      };

    case error(GET_PLACES):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
