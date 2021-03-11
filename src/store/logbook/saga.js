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
    const { data } = yield call(
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

export default function* LogbookWatcher() {
  yield takeLatest(POST_LOGBOOK_ENTRY, postLogbookEntry);
}
