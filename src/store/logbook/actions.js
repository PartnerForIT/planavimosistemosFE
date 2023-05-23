import {
  POST_LOGBOOK_ENTRY,
  POST_LOGBOOK_ENTRY_SUCCESS,
  POST_LOGBOOK_ADD_ENTRY,
  POST_LOGBOOK_ADD_ENTRY_SUCCESS,
} from './types';

export const postLogbookEntry = (id, data, callback) => ({
  type: POST_LOGBOOK_ENTRY,
  id,
  data,
  callback,
});

export const postLogbookEntrySuccess = (data) => ({
  type: POST_LOGBOOK_ENTRY_SUCCESS,
  data,
});

export const postLogbookAddEntry = (id, data, callback) => ({
  type: POST_LOGBOOK_ADD_ENTRY,
  id,
  data,
  callback,
});

export const postLogbookEntryAddSuccess = (data) => ({
  type: POST_LOGBOOK_ADD_ENTRY_SUCCESS,
  data,
});
