// import { success, error } from 'redux-saga-requests';
import {
  GET_EVENTS,
} from './types';

const initialState = {
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return { ...state, error: null, loading: true };

    default: return state;
  }
};

export default reducer;
