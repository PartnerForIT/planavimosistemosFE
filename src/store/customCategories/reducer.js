import { success, error } from 'redux-saga-requests';
import {
  GET_CUSTOM_CATEGORIES,
} from './types';

const initialState = {
  customCategories: [],
  customCategory: null,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOM_CATEGORIES:
      return { ...state, error: null, loading: true };

    case success(GET_CUSTOM_CATEGORIES):
      return {
        ...state,
        customCategories: action.data,
        loading: false,
      };

    case error(GET_CUSTOM_CATEGORIES):
      return {
        ...state, loading: false, error: action.error,
      };

    default: return state;
  }
};

export default reducer;
