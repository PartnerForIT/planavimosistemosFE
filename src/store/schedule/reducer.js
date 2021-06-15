import {
  GET_SHIFT,
  GET_SHIFT_SUCCESS,
  GET_SHIFT_ERROR,
} from './types';

const initialState = {
  shift: null,
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHIFT:
      return { ...state, loading: true };

    case GET_SHIFT_SUCCESS:
      return {
        ...state,
        shift: action.data,
        loading: false,
      };
    case GET_SHIFT_ERROR:
      return { ...state, loading: false };

    default: return state;
  }
};
