import {
  GET_EVENTS_LIST,
  GET_EVENTS_LIST_SUCCESS,
  GET_EVENTS_LIST_ERROR,
  EVENT_VIEWED,
  GET_EVENT_VIEW,
} from './types';

export const getEventsList = (id, data) => ({
  type: GET_EVENTS_LIST,
  id,
  data,
});

export const getEventsListSuccess = (data) => ({
  type: GET_EVENTS_LIST_SUCCESS,
  data,
});

export const getEventsListError = (data) => ({
  type: GET_EVENTS_LIST_ERROR,
  data,
});

export const getEventView = (companyId, id) => ({
  type: GET_EVENT_VIEW,
  companyId,
  id,
});

export const enterViewed = (data) => ({
  type: EVENT_VIEWED,
  data,
});
