import { call, put, takeLatest, delay } from "redux-saga/effects";
import config from 'config';
import axios from "axios";
import {
  GET_SETTINGS_COMPANY,
  PATCH_SETTINGS_COMPANY
} from "./types";

import { getSettingCompanySuccess, editSettingCompanySuccess, addSnackbar, dismissSnackbar } from './actions'

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
        "Content-Type": "multipart/form-data",
      },
    });
    yield put(addSnackbar('company parameters edited successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}



export default function* SettingsWatcher() {
  yield takeLatest(GET_SETTINGS_COMPANY, loadSettingsCompany);
  yield takeLatest(PATCH_SETTINGS_COMPANY, editSettingsCompany);
}
