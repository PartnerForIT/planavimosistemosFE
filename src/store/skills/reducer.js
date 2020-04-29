import { success, error } from 'redux-saga-requests';
import {
  GET_SKILLS,
} from './types';

const initialState = {
  skills: [],
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SKILLS:
      return { ...state, error: null, loading: true };

    case success(GET_SKILLS):
      return {
        ...state,
        skills: action.data,
        loading: false,
      };

    case error(GET_SKILLS):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
