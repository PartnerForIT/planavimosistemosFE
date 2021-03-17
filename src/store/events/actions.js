import {
  POST_LOGBOOK_ENTRY_SUCCESS,
} from './types';

// export const getEvents = (id, data) => ({
//   type: GET_EVENTS,
//   id,
//   data,
// });

// eslint-disable-next-line import/prefer-default-export
export const postLogbookEntrySuccess = (data) => ({
  type: POST_LOGBOOK_ENTRY_SUCCESS,
  data,
});
