import {
  call,
  delay,
  put,
  takeLatest,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  GET_SHEET,
} from './types';
import {
  getSheetSuccess,
  getSheetError,
} from './actions';
import { addSnackbar, dismissSnackbar } from '../organizationList/actions';
import getToken from '../getToken';

function* getSheet(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/sheet?from_date=${action.fromDate}`,
      getToken(),
    );
    yield put(getSheetSuccess(data));
  } catch (error) {
    yield put(getSheetError());
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export default function* SheetWatcher() {
  yield takeLatest(GET_SHEET, getSheet);
  //yield takeLatest(GET_INTEGRATION, getIntegration);
}
