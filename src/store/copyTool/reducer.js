import { ADD_TO_HISTORY, BACK_HISTORY, FORWARD_HISTORY, REMOVE_HISTORY, ADD_TIMELINES } from './types';

const initialState = {
  history: [],
  rollback: [],
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_HISTORY:
      return {
        ...state,
        history: [...state.history.filter((resultItem) => {
          return !(
            resultItem.start <= action.payload.end &&
            resultItem.end >= action.payload.start &&
            resultItem.resourceId == action.payload.resourceId
          );
        }), action.payload],
        rollback: [],
      };
    case BACK_HISTORY:
      if (state.history.length > 0) {
        const lastItem = state.history[state.history.length - 1];
        return {
          ...state,
          history: state.history.slice(0, -1),
          rollback: [...state.rollback, lastItem],
        };
      }
      return state;
    case FORWARD_HISTORY:
      if (state.rollback.length > 0) {
        const lastItem = state.rollback[state.rollback.length - 1];
        return {
          ...state,
          history: [...state.history, lastItem],
          rollback: state.rollback.slice(0, -1),
        };
      }
      return state;
    case REMOVE_HISTORY:
      return {
        ...state,
        history: [],
        rollback: [],
      };
    case ADD_TIMELINES:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default reducer;
