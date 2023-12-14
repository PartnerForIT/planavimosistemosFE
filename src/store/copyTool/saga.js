import {
  call,
  delay,
  put,
  takeLatest,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  ADD_TIMELINES
} from './types';
import {
  getSchedule as getScheduleAction,
} from '../schedule/actions';
import { addSnackbar, dismissSnackbar } from '../organizationList/actions';
import getToken from '../getToken';


function* postAddTimelines(action) {
  try {
    yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/add_timelines`,
      {data: action.data},
      getToken(),
    );
    yield put(getScheduleAction(action.body));
  } catch (error) {
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export default function* CopyToolWatcher() {
  yield takeLatest(ADD_TIMELINES, postAddTimelines);
}
