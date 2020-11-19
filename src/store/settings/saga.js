import { call, put, takeLatest, delay } from "redux-saga/effects";
import config from 'config';
import axios from "axios";
import {
  GET_SETTINGS_COMPANY,
} from "./types";

import { getSettingCompanySuccess } from './actions'

function token() {
  const token = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };
  return token;
}

function* loadSettingsCompany(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/edit`, token());
    console.log('loadSettingsCompany', data)
    yield put(getSettingCompanySuccess(data));
  } catch (error) {
    //yield put(getCountriesError(error));
  }
}



export default function* SettingsWatcher() {
  yield takeLatest(GET_SETTINGS_COMPANY, loadSettingsCompany);

}