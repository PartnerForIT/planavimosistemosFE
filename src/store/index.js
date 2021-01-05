import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import { requestsPromiseMiddleware } from 'redux-saga-requests';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import saga from './saga';
import auth from './auth/reducer';
import worktime from './worktime/reducer';
import employees from './employees/reducer';
import jobTypes from './jobTypes/reducer';
import places from './places/reducer';
import skills from './skills/reducer';
import reports from './reports/reducer';
import overview from './overview/reducer';
import organizationList from './organizationList/reducer';
import settings from './settings/reducer';
import company from './company/reducer';

const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth,
  worktime,
  employees,
  jobTypes,
  places,
  skills,
  reports,
  overview,
  organizationList,
  settings,
  company,
});

const middlewares = [
  thunkMiddleware,
  requestsPromiseMiddleware({ auto: true }),
  sagaMiddleware,
];

// Disable Logger at server side.
// eslint-disable-next-line no-undef
if (process.browser && process.env.NODE_ENV !== 'production') {
  middlewares.push(loggerMiddleware);
}

const store = createStore(rootReducer, undefined, composeWithDevTools(applyMiddleware(...middlewares)));

sagaMiddleware.run(() => saga(store.dispatch, store.getState));

export default store;
