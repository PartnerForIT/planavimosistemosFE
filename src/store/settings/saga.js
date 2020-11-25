import { call, put, takeLatest, delay } from "redux-saga/effects";
import config from 'config';
import axios from "axios";
import {
  GET_SETTINGS_COMPANY,
  PATCH_SETTINGS_COMPANY,
  GET_WORK_TIME,
  PATCH_WORK_TIME,
  ADD_HOLIDAY,
  DELETE_HOLIDAY,
  GET_SECURITY_COMPANY,
} from "./types";
import {
  getSettingCompanySuccess, addSnackbar,
  dismissSnackbar, getSettingWorkTimeSuccess, addHolidaySuccess, deleteHolidaySuccess,
  getSecurityCompanySuccess
} from './actions'

function token() {
  const token = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };
  return token;
}

function* loadSettingsCompany(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/edit`, token());
    yield put(getSettingCompanySuccess(data));
  } catch (error) {
    console.log(error);
  }
}

function* editSettingsCompany(action) {
  try {
    const { data } = yield call(axios.patch, `${config.api.url}/company/${action.id}/update`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(addSnackbar('Company parameters edited successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('Company edit error', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadSettingsWorkTime(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/work-time`, token());
    yield put(getSettingWorkTimeSuccess(data))
  } catch (error) {
    console.log(error);
  }
}

function* editSettingsWorkTime(action) {
  try {
    const { data } = yield call(axios.patch, `${config.api.url}/company/${action.id}/work-time/update`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(addSnackbar('Work time edited successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('Work time edited error', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* addCompanyHoliday(action) {
  try {
    const { data } = yield call(axios.post, `${config.api.url}/company/${action.id}/work-time/holidays/create`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(addHolidaySuccess(data));
    yield put(addSnackbar('Holiday added successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());

  } catch (e) {
    yield put(addSnackbar('An error occurred while adding a holiday', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* deleteCompanyHoliday(action) {
  try {
    const { data } =
      yield call(axios.delete, `${config.api.url}/company/${action.companyId}/work-time/holidays/delete/${action.id}`, token());
    yield put(addSnackbar('Holiday deleted successfully', 'success'));
    yield put(deleteHolidaySuccess(action.id));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while deleting a holiday', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadSecurityCompany(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/security`, token());
    yield put(getSecurityCompanySuccess(data));
  } catch (error) {
    console.log(error);
  }
}


export default function* SettingsWatcher() {
  yield takeLatest(GET_SETTINGS_COMPANY, loadSettingsCompany);
  yield takeLatest(PATCH_SETTINGS_COMPANY, editSettingsCompany);
  yield takeLatest(GET_WORK_TIME, loadSettingsWorkTime);
  yield takeLatest(PATCH_WORK_TIME, editSettingsWorkTime);
  yield takeLatest(ADD_HOLIDAY, addCompanyHoliday);
  yield takeLatest(DELETE_HOLIDAY, deleteCompanyHoliday);
  yield takeLatest(GET_SECURITY_COMPANY, loadSecurityCompany);
}
