import {
  call,
  delay,
  put,
  takeLatest,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  GET_SCHEDULE,
  POST_SHIFT,
  GET_SHIFT,
  PUT_SHIFT,
  PATCH_MARKER,
  PATCH_GENERATE_TIMES,
  PATCH_CLEAR_TIMES,
  PATCH_CHANGE_EMPLOYEE,
  PATCH_CHANGE_TIMELINE,
  PATCH_ADD_TIMELINE,
  DELETE_TIMELINE,
  EMPTY_TIMELINE,
  DELETE_SHIFT, ADD_TEMP_EMPLOYEE,
} from './types';
import {
  getScheduleSuccess,
  getScheduleError,
  patchMarkerSuccess,
  patchMarkerError,
  postShiftSuccess,
  postShiftError,
  getShiftSuccess,
  getShiftError,
  putShiftSuccess,
  putShiftError,
  getSchedule as getScheduleAction,
} from './actions';
import { addSnackbar, dismissSnackbar } from '../organizationList/actions';
import getToken from '../getToken';

function* getSchedule(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/shift?type=${action.timeline}&from_date=${action.fromDate}&shiftTypeArr=${action.shiftTypeArr}&employeesArr=${action.employeesArr}&placesArr=${action.placesArr}`,
      getToken(),
    );
    yield put(getScheduleSuccess(data));
  } catch (error) {
    yield put(getScheduleError());
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* postShift(action) {
  try {
    yield call(
      axios.post,
      `${config.api.url}/company/${action.companyId}/shift/store`,
      action.data,
      getToken(),
    );
    yield put(postShiftSuccess());
  } catch (error) {
    yield put(postShiftError());
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* getShift(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/shift/${action.shiftId}`,
      getToken(),
    );
    yield put(getShiftSuccess(data));
  } catch (error) {
    yield put(getShiftError());
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* putShift(action) {
  try {
    const { data } = yield call(
      axios.post,
      `${config.api.url}/company/${action.companyId}/shift/edit/${action.id}`,
      action.data,
      getToken(),
    );
    yield put(putShiftSuccess(data));
  } catch (error) {
    yield put(putShiftError());
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchMarker(action) {
  try {
    const { data } = yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/marker`,
      action.data,
      getToken(),
    );
    
    yield put(patchMarkerSuccess(data));

  } catch (error) {
    yield put(patchMarkerError());
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchGenerateTimes(action) {
  try {
    yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/shift/${action.shiftId}/generate-times`,
      action.data,
      getToken(),
    );
    
    yield put(getScheduleAction(action.body));
    yield put(addSnackbar("Schedule generated successfully"));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (error) {
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchClearTimes(action) {
  try {
    yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/shift/${action.shiftId}/clear-times`,
      action.data,
      getToken(),
    );
    
    yield put(getScheduleAction(action.body));
  } catch (error) {
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchChangeEmployee(action) {
  try {
    yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/shift/${action.shiftId}/change/employee`,
      action.data,
      getToken(),
    );
    
    yield put(getScheduleAction(action.body));
  } catch (error) {
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchChangeTimeline(action) {
  try {
    yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/shift/${action.shiftId}/change/timeline`,
      action.data,
      getToken(),
    );
    yield put(getScheduleAction(action.body));
  } catch (error) {
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchAddTimeline(action) {
  try {
    yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/shift/${action.shiftId}/add/timeline`,
      action.data,
      getToken(),
    );
    yield put(getScheduleAction(action.body));
  } catch (error) {
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* addTempEmployee(action){
  try {
    yield call(
        axios.post,
        `${config.api.url}/company/${action.companyId}/shift/add-assistant/${action.shiftId}`,
        action.data,
        getToken()
    )

    yield put(getScheduleAction(action.body));
  }catch (error) {
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* deleteTimeline(action) {
  try {
    yield call(
      axios.delete,
      `${config.api.url}/company/${action.companyId}/shift/${action.shiftId}/delete/timeline/${action.id}`,
      getToken(),
    );
    yield put(getScheduleAction(action.body));
  } catch (error) {
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* emptyTimeline(action) {
  try {
    yield call(
      axios.delete,
      `${config.api.url}/company/${action.companyId}/shift/${action.shiftId}/empty/timeline/${action.id}`,
      getToken(),
    );
    yield put(getScheduleAction(action.body));
  } catch (error) {
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* deleteShift(action) {
  try {
    yield call(
      axios.delete,
      `${config.api.url}/company/${action.companyId}/shift/delete/${action.id}`,
      getToken(),
    );
    yield put(getScheduleAction(action.body));
  } catch (error) {
    yield put(addSnackbar(error, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export default function* ScheduleWatcher() {
  yield takeLatest(GET_SCHEDULE, getSchedule);
  yield takeLatest(GET_SHIFT, getShift);
  yield takeLatest(POST_SHIFT, postShift);
  yield takeLatest(PUT_SHIFT, putShift);
  yield takeLatest(PATCH_MARKER, patchMarker);
  yield takeLatest(PATCH_GENERATE_TIMES, patchGenerateTimes);
  yield takeLatest(PATCH_CLEAR_TIMES, patchClearTimes);
  yield takeLatest(PATCH_CHANGE_EMPLOYEE, patchChangeEmployee);
  yield takeLatest(PATCH_CHANGE_TIMELINE, patchChangeTimeline);
  yield takeLatest(PATCH_ADD_TIMELINE, patchAddTimeline);
  yield takeLatest(DELETE_TIMELINE, deleteTimeline);
  yield takeLatest(EMPTY_TIMELINE, emptyTimeline);
  yield takeLatest(DELETE_SHIFT, deleteShift);
  yield takeLatest(ADD_TEMP_EMPLOYEE,addTempEmployee)
}
