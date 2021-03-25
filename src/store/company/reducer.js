/* eslint-disable camelcase */
import { success, error } from 'redux-saga-requests';
import {
  GET_ORGANISATION_MODULES,
} from './types';

const initialState = {
  modules: {},
  loading: false,
  requestWasSent: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORGANISATION_MODULES:
      return {
        ...state, error: null, loading: true, requestWasSent: true,
      };
    case success(GET_ORGANISATION_MODULES): {
      return { ...state, modules: action.data, loading: false };
    }
    case error(GET_ORGANISATION_MODULES): {
      return { ...state, error: action.error, loading: false };
    }
    default: return state;
  }
};

export default reducer;
