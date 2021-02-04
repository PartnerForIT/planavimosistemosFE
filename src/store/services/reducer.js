/* eslint-disable camelcase */
import { success, error } from 'redux-saga-requests';
import { GET_INFO } from './types';

const initialState = {
  email: '',
  security: {},
  company: {},
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INFO:
      return { ...state, error: null, loading: true };

    case success(GET_INFO):
      return {
        ...state,
        email: action.password?.email,
        security: action.security,
        company: action.company,
        loading: false,
      };

    case error(GET_INFO):
      return {
        ...state, loading: false, error: action.error,
      };

    default:
      return state;
  }
};

export default reducer;
