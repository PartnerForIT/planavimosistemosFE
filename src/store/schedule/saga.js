import {
  call,
  delay,
  put,
  takeLatest,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  GET_SHIFT,
} from './types';
import { getShiftSuccess, getShiftError } from './actions';
import { addSnackbar, dismissSnackbar } from '../organizationList/actions';
import getToken from '../getToken';

function* getShift(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/shift?type=${action.timeline}`,
      getToken(),
    );
    yield put(getShiftSuccess(data));
  } catch (error) {
    yield put(getShiftError());
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export default function* ScheduleWatcher() {
  yield takeLatest(GET_SHIFT, getShift);
}
