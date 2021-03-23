import {
  call,
  put,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  GET_EVENTS_LIST,
  GET_EVENT_VIEW,
} from './types';
import {
  addSnackbar,
  dismissSnackbar,
} from '../organizationList/actions';
import {
  getEventsListSuccess,
  getEventsListError,
} from './actions';

function token() {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };
}

function* getEventsList(action) {
  try {
    const { data } = yield call(
      axios.post,
      `${config.api.url}/company/${action.id}/events/list`,
      action.data,
      token(),
    );
    yield put(getEventsListSuccess(data));
  } catch (e) {
    yield put(getEventsListError());
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* getEventView(action) {
  try {
    yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/events/view/${action.id}`,
      token(),
    );
  } catch (e) {
    yield put(getEventsListError());
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export default function* EventsWatcher() {
  yield takeLatest(GET_EVENTS_LIST, getEventsList);
  yield takeLatest(GET_EVENT_VIEW, getEventView);
}
