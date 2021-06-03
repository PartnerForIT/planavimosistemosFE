import {
  call,
  put,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  POST_SUPPORT_TICKET,
} from './types';
import {
  addSnackbar,
  dismissSnackbar,
} from '../organizationList/actions';
import {
  postSupportTicketError,
  postSupportTicketSuccess,
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

export default function* EventsWatcher() {
  yield takeLatest(POST_SUPPORT_TICKET, postSupportTicket);
}
