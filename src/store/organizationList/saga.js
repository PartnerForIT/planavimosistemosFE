import { call, put, takeLatest } from "redux-saga/effects";
import config from 'config';
import axios from "axios";
import {
  GET_COUNTRIES,
} from "./types";
import {getCountriesSuccess, getCountriesError} from "./actions"


function* loadCountries( ) {
  const token = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };
  try {
    const { data } = yield call(axios.get, `${config.api.url}/countries`,token );
    console.log("data", data); 
    yield put(getCountriesSuccess(data));
  } catch (error) {
    yield put(getCountriesError(error));
  }
}

export default function* OrganizationListWatcher() {
  yield takeLatest(GET_COUNTRIES, loadCountries);
}