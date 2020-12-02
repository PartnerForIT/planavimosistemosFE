import { call, put, takeLatest, delay } from "redux-saga/effects";
import config from 'config';
import axios from "axios";
import {
  GET_SETTINGS_COMPANY,
  PATCH_SETTINGS_COMPANY,
  GET_WORK_TIME, PATCH_WORK_TIME, ADD_HOLIDAY,
  DELETE_HOLIDAY, GET_SECURITY_COMPANY, PATCH_SECURITY_COMPANY,
  GET_SKILLS, CREATE_SKILL, CREATE_JOB,
  CREATE_PLACE, GET_PLACE, GET_ACTIVITY_LOG, GET_EMPLOYEES, FILTER_ACTIVITY_LOG,
  GET_DELETE_DATA, DELETE_DATA
} from "./types";
import {
  getSettingCompanySuccess, addSnackbar,
  dismissSnackbar, getSettingWorkTimeSuccess, addHolidaySuccess, deleteHolidaySuccess,
  getSecurityCompanySuccess, editSecurityPageSuccess, loadSkillsSuccess, createSkillSuccess,
  loadPlaceSuccess, loadActivityLogSuccess, loadEmployeesSuccess, loadDeleteDataSuccess
} from './actions'
import { yellow } from "@material-ui/core/colors";
import { getEmployee } from "store/employees/actions";

function token() {
  const token = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };
  return token;
}

function* loadSettingsCompany(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/edit`, token());
    yield put(getSettingCompanySuccess(data));
  } catch (error) {
    console.log(error);
  }
}

function* editSettingsCompany(action) {
  try {
    const { data } = yield call(axios.patch, `${config.api.url}/company/${action.id}/update`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(addSnackbar('Company parameters edited successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('Company edit error', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadSettingsWorkTime(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/work-time`, token());
    yield put(getSettingWorkTimeSuccess(data))
  } catch (error) {
    console.log(error);
  }
}

function* editSettingsWorkTime(action) {
  try {
    const { data } = yield call(axios.patch, `${config.api.url}/company/${action.id}/work-time/update`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(addSnackbar('Work time edited successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('Work time edited error', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* addCompanyHoliday(action) {
  try {
    const { data } = yield call(axios.post, `${config.api.url}/company/${action.id}/work-time/holidays/create`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(addHolidaySuccess(data));
    yield put(addSnackbar('Holiday added successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());

  } catch (e) {
    yield put(addSnackbar('An error occurred while adding a holiday', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* deleteCompanyHoliday(action) {
  try {
    const { data } =
      yield call(axios.delete, `${config.api.url}/company/${action.companyId}/work-time/holidays/delete/${action.id}`, token());
    yield put(addSnackbar('Holiday deleted successfully', 'success'));
    yield put(deleteHolidaySuccess(action.id));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while deleting a holiday', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadSecurityCompany(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/security`, token());
    yield put(getSecurityCompanySuccess(data));
  } catch (error) {
    console.log(error);
  }
}

function* changeSecurityCompany(action) {
  try {
    const { data } = yield call(axios.patch, `${config.api.url}/company/${action.id}/security/update`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(editSecurityPageSuccess(data));
    yield put(addSnackbar('Security settings changed successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while changing security settings', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadSettingsSkills(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/specialities`, token());
    yield put(loadSkillsSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* createSettingSkill(action) {
  try {
    const { data } = yield call(axios.post, `${config.api.url}/company/${action.id}/specialities/create`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(createSkillSuccess(data));
    yield put(addSnackbar('Skill creation successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the skill', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* creacteJob(action) {
  try {
    const { data } = yield call(axios.post, `${config.api.url}/company/${action.id}/job-types/create`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(addSnackbar('Job creation successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Job', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* createPlace(action) {
  try {
    const { data } = yield call(axios.post, `${config.api.url}/company/${action.id}}/places/create`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(addSnackbar('Place creation successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Place', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadCompanyPLace(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/places`, token());
    yield put(loadPlaceSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* loadActivityLog(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/activity-log`, token());
    yield put(loadActivityLogSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* filterActivityLog(action) {
  try {
    const { data } = yield call(axios.post, `${config.api.url}/company/${action.id}/activity-log`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(loadActivityLogSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* loadEmployee(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/employees/all`, token());
    yield put(loadEmployeesSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* loadDeleteData(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/delete-data`, token());
    yield put(loadDeleteDataSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* deleteCompanyData(action) {
  try {
    yield call(axios.delete, `${config.api.url}/company/${action.id}/delete-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        employee_id: action.data.employee_id,
        startDate: action.data.date_from,
        endDate: action.data.date_to,
      }
    });
    yield put(addSnackbar('Data deleted successfully', 'success'));
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/delete-data`, token());
    yield put(loadDeleteDataSuccess(data));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while deleting a Data', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export default function* SettingsWatcher() {
  yield takeLatest(GET_SETTINGS_COMPANY, loadSettingsCompany);
  yield takeLatest(PATCH_SETTINGS_COMPANY, editSettingsCompany);
  yield takeLatest(GET_WORK_TIME, loadSettingsWorkTime);
  yield takeLatest(PATCH_WORK_TIME, editSettingsWorkTime);
  yield takeLatest(ADD_HOLIDAY, addCompanyHoliday);
  yield takeLatest(DELETE_HOLIDAY, deleteCompanyHoliday);
  yield takeLatest(GET_SECURITY_COMPANY, loadSecurityCompany);
  yield takeLatest(PATCH_SECURITY_COMPANY, changeSecurityCompany);
  yield takeLatest(GET_SKILLS, loadSettingsSkills);
  yield takeLatest(CREATE_SKILL, createSettingSkill);
  yield takeLatest(CREATE_JOB, creacteJob);
  yield takeLatest(CREATE_PLACE, createPlace);
  yield takeLatest(GET_PLACE, loadCompanyPLace);
  yield takeLatest(GET_ACTIVITY_LOG, loadActivityLog);
  yield takeLatest(GET_EMPLOYEES, loadEmployee);
  yield takeLatest(FILTER_ACTIVITY_LOG, filterActivityLog)
  yield takeLatest(GET_DELETE_DATA, loadDeleteData)
  yield takeLatest(DELETE_DATA, deleteCompanyData)
}
