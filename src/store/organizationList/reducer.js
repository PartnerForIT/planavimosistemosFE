
import {
  GET_COUNTRIES,
  GET_COUNTRIES_SUCCESS,
  GET_COUNTRIES_ERROR,
} from './types';

const initialState = {
  countries: null,
  loading: false,
  error: null
};

export const reducerOrganizationList = (state = initialState, action) => {
  switch (action.type) {
    case GET_COUNTRIES:
      return { ...state, error: null, loading: true };

    case GET_COUNTRIES_SUCCESS:
      return {
        ...state,
        countries: action.data,
        loading: false,
      };
      case GET_COUNTRIES_ERROR:
        return {
          ...state,
          loading: false,
          error: true,
        };
    

    default: return state;
  }
};

export default reducerOrganizationList;