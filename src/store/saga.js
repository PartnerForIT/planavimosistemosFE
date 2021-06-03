import axios from 'axios';
import { createRequestInstance, watchRequests } from 'redux-saga-requests';
import { all } from 'redux-saga/effects';
import { createDriver } from 'redux-saga-requests-axios';
import config from 'config';
import routes from 'config/routes';

import OverviewWatcher from './overview/saga';
import OrganizationListWatcher from './organizationList/saga';
import SettingsWatcher from './settings/saga';
import LogbookWatcher from './logbook/saga';
import EventsWatcher from './events/saga';
import KiosksWatcher from './kiosks/saga';
import CompanyWatcher from './company/saga';

function onRequest(request) {
  // intercept a request here
  request.url = config.api.url + request.url;
  if (localStorage.getItem('token')) {
    request.headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }
  return request;
}

function onError(error, action) {
  if (error.response.status === 401) {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    window.location.href = routes.ROOT;
  }
  return { error, action };
}

export default function* rootSaga() {
  yield all([
    OverviewWatcher(),
    OrganizationListWatcher(),
    SettingsWatcher(),
    LogbookWatcher(),
    EventsWatcher(),
    KiosksWatcher(),
    CompanyWatcher(),
    createRequestInstance({
      onRequest,
      onError,
      driver: createDriver(axios),
    }),
    watchRequests(),
  ]);
}
