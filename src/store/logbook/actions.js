import {
  POST_LOGBOOK_ENTRY,
  POST_LOGBOOK_ENTRY_SUCCESS,
} from './types';

export const postLogbookEntry = (id, data) => ({
  type: POST_LOGBOOK_ENTRY,
  id,
  data,
});

export const postLogbookEntrySuccess = (data) => ({
  type: POST_LOGBOOK_ENTRY_SUCCESS,
  data,
});
