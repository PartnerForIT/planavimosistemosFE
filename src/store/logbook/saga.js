import {
  call,
  put,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  POST_LOGBOOK_ENTRY,
  POST_LOGBOOK_ADD_ENTRY,
} from './types';
import {
  addSnackbar,
  dismissSnackbar,
} from '../organizationList/actions';
// import {
//   postLogbookEntrySuccess,
// } from './actions';

function token() {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };
}

function* postLogbookEntry(action) {
  try {
    yield call(
      axios.post,
      `${config.api.url}/company/${action.id}/logbook/edit`,
      action.data,
      token(),
    );
    action.callback();
    // yield put(postLogbookEntrySuccess(data));
    yield put(addSnackbar('Updated logbook successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export function* LogbookWatcher() {
  yield takeLatest(POST_LOGBOOK_ENTRY, postLogbookEntry);
}

function* postLogbookAddEntry(action) {
  try {
    yield call(
      axios.post,
      `${config.api.url}/company/${action.id}/logbook/add`,
      action.data,
      token(),
    );
    action.callback();
    // yield put(postLogbookEntrySuccess(data));
    yield put(addSnackbar('Added logbook successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export function* LogbookAddWatcher() {
  yield takeLatest(POST_LOGBOOK_ADD_ENTRY, postLogbookAddEntry);
}
