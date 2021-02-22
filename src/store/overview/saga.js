import { call, put, takeLatest } from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  GET_OVERVIEW,
} from './types';
import { getOverviewSuccess, getOverviewError } from './actions';

function* getOverview() {
  const token = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };
  try {
    const { data } = yield call(axios.get, `${config.api.url}/admin/overview`, token);
    yield put(getOverviewSuccess(data));
  } catch (error) {
    yield put(getOverviewError(error));
  }
}

export default function* OverviewWatcher() {
  yield takeLatest(GET_OVERVIEW, getOverview);
}
