// import { success, error } from 'redux-saga-requests';
import {
  POST_LOGBOOK_ENTRY,
  POST_LOGBOOK_ADD_ENTRY,
} from './types';

const initialState = {
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LOGBOOK_ENTRY:
      return { ...state, error: null, loading: true };
    case POST_LOGBOOK_ADD_ENTRY:
      return { ...state, error: null, loading: true };

    default: return state;
  }
};

export default reducer;
