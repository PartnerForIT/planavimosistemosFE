import {
  call,
  put,
  takeLatest,
  delay, takeLeading,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  POST_SUPPORT_TICKET,
  GET_COMPANY_INFO,
} from './types';
import {
  addSnackbar,
  dismissSnackbar,
} from '../organizationList/actions';
import {
  postSupportTicketError,
  postSupportTicketSuccess,
  getCompanyInfoSuccess,
} from './actions';
import getToken from '../getToken';

function* postSupportTicket(action) {
  try {
    yield call(
      axios.post,
      `${config.api.url}/company/${action.companyId}/support-ticket/create`,
      action.data,
      getToken(),
    );
    yield put(postSupportTicketSuccess());
  } catch (e) {
    yield put(postSupportTicketError());
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* getCompanyInfo(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.id}/edit`,
      getToken(),
    );
    yield put(getCompanyInfoSuccess(data));
  } catch (error) {
    console.log(error);
  }
}

export default function* EventsWatcher() {
  yield takeLatest(POST_SUPPORT_TICKET, postSupportTicket);
  yield takeLeading(GET_COMPANY_INFO, getCompanyInfo);
}
