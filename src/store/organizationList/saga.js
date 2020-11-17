import { call, put, takeLatest, delay } from "redux-saga/effects";
import config from 'config';
import axios from "axios";
import {
  GET_COUNTRIES,
  POST_ORGANIZATION,
  GET_COMPANIES,
  POST_CHANGE_OF_STATUS
} from "./types";
import { getCountriesSuccess,getCountriesError, 
          addSnackbar,dismissSnackbar, getCompaniesSuccess, addOrganizationSuccess} from "./actions"

function token() {
  const token = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };
  return token;
}

function* loadCountries( ) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/countries`,token() );
    yield put(getCountriesSuccess(data));
  } catch (error) {
    yield put(getCountriesError(error));
  }
}

function* addNewOrganization (actions) {
  try {
    const { data } = yield call(axios.post, `${config.api.url}/company/store`, actions.data, token() );
   yield put(addOrganizationSuccess(data))
    yield put(addSnackbar('New organization added successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());

  } catch(e) {
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadCompanies ({params}) {
  try {
    const {data} = yield call(axios.get, `${config.api.url}/companies`, 
    { 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, 
      params: params ? params : null 
    });
    yield put(getCompaniesSuccess(data))
  } catch(error) {
    console.log('error', error)
  }
}

function* changeStatusOrganizations(actions) {
  try {
    yield call(axios.post, `${config.api.url}/company/mass-action`, actions.data, token() );
    const {data} = yield call(axios.get, `${config.api.url}/companies`, 
    { 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, 
      params: null 
    });
    yield put(getCompaniesSuccess(data))
    yield put(addSnackbar('Organization status changed', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch(e) {
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());

  }
}

export default function* OrganizationListWatcher() {
  yield takeLatest(GET_COUNTRIES, loadCountries);
  yield takeLatest(POST_ORGANIZATION, addNewOrganization);
  yield takeLatest(GET_COMPANIES, loadCompanies);
  yield takeLatest(POST_CHANGE_OF_STATUS, changeStatusOrganizations);
}