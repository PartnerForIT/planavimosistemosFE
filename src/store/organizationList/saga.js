import { call, put, takeLatest, delay } from "redux-saga/effects";
import config from 'config';
import axios from "axios";
import {
  GET_COUNTRIES,
  POST_ORGANIZATION,
} from "./types";
import { getCountriesSuccess, 
          getCountriesError, 
          addSnackbar, 
          dismissSnackbar} from "./actions"


function* loadCountries( ) {
  const token = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };
  try {
    const { data } = yield call(axios.get, `${config.api.url}/countries`,token );
    yield put(getCountriesSuccess(data));
  } catch (error) {
    yield put(getCountriesError(error));
  }
}

function* addNewOrganization (actions) {
  const token = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };
  try {
    const { data } = yield call(axios.post, `${config.api.url}/company/store`,actions.data, token );

    yield put(addSnackbar('New organization added successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());

  } catch(error) {
    yield put(addSnackbar('Add organizations Error', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export default function* OrganizationListWatcher() {
  yield takeLatest(GET_COUNTRIES, loadCountries);
  yield takeLatest(POST_ORGANIZATION, addNewOrganization);
}