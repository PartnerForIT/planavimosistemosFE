import { ADD_TO_HISTORY, GET_HISTORY, REMOVE_HISTORY, BACK_HISTORY, FORWARD_HISTORY, ADD_TIMELINES } from './types';

export const addToHistory = (data) => ({
  type: ADD_TO_HISTORY,
  payload: data,
});

export const getHistory = () => ({
  type: GET_HISTORY,
});

export const removeHistory = () => ({
  type: REMOVE_HISTORY,
});

export const backHistory = () => ({
  type: BACK_HISTORY,
});

export const forwardHistory = () => ({
  type: FORWARD_HISTORY,
});
export const addTimelines = ({
  companyId,
  data,
  body,
}) => ({
  type: ADD_TIMELINES,
  companyId,
  data,
  body,
});
