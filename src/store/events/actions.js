import {
  GET_EVENTS,
  POST_LOGBOOK_ENTRY_SUCCESS,
} from './types';

// export const getEvents = (id, data) => ({
//   type: GET_EVENTS,
//   id,
//   data,
// });

export const postLogbookEntrySuccess = (data) => ({
  type: POST_LOGBOOK_ENTRY_SUCCESS,
  data,
});
