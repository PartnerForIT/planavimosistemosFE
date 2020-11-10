
import {
  GET_OVERVIEW,
  GET_OVERVIEW_SUCCESS,
  GET_OVERVIEW_ERROR,
} from './types';

const initialState = {
  users: null,
  loading: false,
  error: null
};

export const reducerOverview = (state = initialState, action) => {
  switch (action.type) {
    case GET_OVERVIEW:
      return { ...state, error: null, loading: true };

    case GET_OVERVIEW_SUCCESS:
      return {
        ...state,
        users: action.data,
        loading: false,
      };
      case GET_OVERVIEW_SUCCESS:
        return {
          ...state,
          loading: false,
          error: true,
        };
    

    default: return state;
  }
};

export default reducerOverview;