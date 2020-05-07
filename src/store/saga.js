import axios from 'axios';
import { createRequestInstance, watchRequests } from 'redux-saga-requests';
import { createDriver } from 'redux-saga-requests-axios';
import config from 'config';
import routes from 'config/routes';

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
  yield createRequestInstance({
    onRequest,
    onError,
    driver: createDriver(axios),
  });
  yield watchRequests();
}
