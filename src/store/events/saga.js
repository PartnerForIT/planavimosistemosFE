import {
  call,
  put,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  GET_EVENTS,
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

function* getEvents(action) {
  try {
    yield call(
      axios.get,
      `${config.api.url}/company/${action.id}/events`,
      token(),
    );
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

export default function* EventsWatcher() {
  yield takeLatest(GET_EVENTS, getEvents);
}
