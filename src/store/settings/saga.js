/* eslint-disable camelcase */
import {
  call, put, takeLatest, delay, select, takeLeading,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  GET_SETTINGS_COMPANY,
  PATCH_LANG_SETTINGS_COMPANY,
  PATCH_SETTINGS_COMPANY,
  GET_SETTINGS_WORK_TIME,
  PATCH_WORK_TIME,
  GET_WORKING_DAYS,
  GET_HOLIDAYS,
  ADD_HOLIDAY,
  DELETE_HOLIDAY,
  GET_SECURITY_COMPANY,
  PATCH_SECURITY_COMPANY,
  GET_SETTINGS_SKILLS,
  CREATE_SKILL,
  CREATE_JOB,
  CREATE_PLACE,
  GET_PLACE,
  CREATE_CUSTOM_CATEGORY,
  GET_CUSTOM_CATEGORY,
  GET_COMPANY_SHIFT,
  GET_COMPANY_JOB_TYPE,
  GET_ACTIVITY_LOG,
  GET_SETTINGS_EMPLOYEES,
  FILTER_ACTIVITY_LOG,
  GET_DELETE_DATA,
  DELETE_DATA,
  GET_LOGBOOK_JOURNAL,
  EDIT_LOGBOOK_JOURNAL,
  GET_LOGBOOK_OVERTIME,
  EDIT_LOGBOOK_OVERTIME,
  GET_LOGBOOK_ADDITIONAL_RATES,
  EDIT_LOGBOOK_ADDITIONAL_RATES,
  GET_LOGBOOK_CLOCK,
  EDIT_LOGBOOK_CLOCK,
  GET_AUTO_DELETE,
  EDIT_AUTO_DELETE,
  GET_TIME_SHEET,
  EDIT_TIME_SHEET,
  GET_INTEGRATIONS,
  EDIT_INTEGRATIONS,
  GET_ACCOUNTS_GROUPS,
  CREATE_ACCOUNTS_GROUP,
  CREATE_ACCOUNTS_SUBGROUP,
  DELETE_ACCOUNTS_GROUP,
  DELETE_ACCOUNTS_SUBGROUP,
  PATCH_ACCOUNTS_GROUP,
  PATCH_ACCOUNTS_SUBGROUP,
  GET_SETTINGS_EMPLOYEES_ALL,
  GET_SETTINGS_EMPLOYEES_EDIT,
  UPDATE_EMPLOYEE,
  UPDATE_EMPLOYEE_LOGBOOK,
  GET_CURRENCY,
  DELETE_EMPLOYEE,
  EMPLOYEE_ACTIONS,
  CREATE_EMPLOYEE,
  GET_ROLES,
  CREATE_ROLE,
  DELETE_ROLE,
  UPDATE_ROLE,
  GET_TIME_OFFS,
  CREATE_TIME_OFF,
  DELETE_TIME_OFF,
  UPDATE_TIME_OFF,
  GET_POLICIES,
  CREATE_POLICY,
  DELETE_POLICY,
  UPDATE_POLICY,
  UPDATE_POLICY_SETTINGS,
  UPDATE_POLICY_EMPLOYEES,
  DUPLICATE_POLICY,
  CREATE_REQUEST_BEHALF,
  UPDATE_REQUEST_BEHALF,
  CHANGE_REQUEST_BEHALF_STATUS,
  GET_REQUEST_BEHALF,
  CREATE_ADJUST_BALANCE,
  CREATE_ADJUST_TIME_USED,
  LOAD_PERMISSIONS,
  GET_SETTINGS_EMPLOYEES_QUERY,
  ADD_INFO_SETTING_SNACKBAR, SEND_IMPORTED_EMPLOYEES, CHANGE_PASSWORD,
  SEND_IMPORTED_PLACES,
  PATCH_PLACE,
  DELETE_PLACE,
  PATCH_CUSTOM_CATEGORY,
  DELETE_CUSTOM_CATEGORY,
  PATCH_JOB,
  DELETE_JOB,
  PATCH_SKILL,
  DELETE_SKILL,
  GET_EVENTS,
  POST_EVENT,
  PATCH_EVENT,
  DELETE_EVENT,
  GET_SETTINGS_SCHEDULE,
  POST_SETTINGS_SCHEDULE,
} from './types';
import {
  getSettingCompanySuccess,
  addSnackbar,
  dismissSnackbar,
  getSettingWorkTimeSuccess,
  getWorkingDaysSuccess,
  getHolidaysSuccess,
  addHolidaySuccess,
  deleteHolidaySuccess,
  getSecurityCompanySuccess,
  editSecurityPageSuccess,
  loadSkillsSuccess,
  createSkillSuccess,
  loadPlaceSuccess,
  loadCustomCategorySuccess,
  loadShiftSuccess,
  loadJobTypeSuccess,
  loadActivityLogSuccess,
  loadEmployeesSuccess,
  loadDeleteDataSuccess,
  loadLogbookJournalSuccess,
  // editLogbookJournalSuccess,
  loadLogbookOvertimeSuccess,
  // editLogbookOvertimeSuccess,
  loadTimeSheetSuccess,
  loadIntegrationsSuccess,
  loadLogbookAdditionalRatesSuccess,
  editLogbookAdditionalRatesSuccess,
  loadLogbookClockSuccess,
  editLogbookClockSuccess,
  loadAutoDeleteSuccess,
  editAutoDeleteSuccess,
  getAccountGroupsSuccess,
  createAccountGroupSuccess,
  createAccountGroupError,
  removeAccountGroupSuccess,
  removeAccountGroupError,
  createAccountSubgroupSuccess,
  removeAccountSubgroupSuccess,
  removeAccountSubgroupError,
  editAccountSubgroupError,
  editAccountGroupError,
  editAccountGroupSuccess,
  editAccountSubgroupSuccess,
  getRolesSuccess,
  getRolesError,
  createRoleError,
  createRoleSuccess,
  deleteRoleError,
  deleteRoleSuccess,
  updateRoleSuccess,
  updateRoleError,
  getTimeOffs,
  getTimeOffsSuccess,
  getTimeOffsError,
  createTimeOffError,
  //createTimeOffSuccess,
  deleteTimeOffError,
  //deleteTimeOffSuccess,
  updateTimeOffSuccess,
  updateTimeOffError,
  getPolicies,
  getPoliciesSuccess,
  getPoliciesError,
  createPolicyError,
  //createPolicySuccess,
  deletePolicyError,
  //deletePolicySuccess,
  //updatePolicySuccess,
  updatePolicyError,
  //duplicatePolicySuccess,
  updatePolicySettingsError,
  updatePolicySettingsSuccess,
  duplicatePolicyError,
  createRequestBehalfError,
  updateRequestBehalfError,
  changeRequestBehalfStatusError,
  getRequestBehalf,
  getRequestBehalfSuccess,
  getRequestBehalfError,
  createAdjustBalanceError,
  createAdjustTimeUsedError,
  loadEmployeesError,
  loadEmployeesEditSuccess,
  loadEmployeesEditError,
  patchEmployeeError,
  patchEmployeeLogbookError,
  loadEmployeesAll,
  getCurrenciesSuccess,
  removeEmployeeError,
  removeEmployeeSuccess,
  setEmployeesActionsError,
  createEmployeeError,
  loadPermissionsSuccess,
  loadPermissionsError,
  getRoles, sendImportedEmployeesSuccess, changePasswordSuccess, changePasswordError,
  sendImportedPlacesSuccess,
  loadSkills,
  getEventsSuccess,
  patchEventSuccess,
  deleteEventSuccess,
  postEventSuccess,
  getScheduleSuccess,
  getScheduleError,
} from './actions';
import { getJobTypes } from '../jobTypes/actions';
import { getPlaces } from '../places/actions';
import { getCustomCategories } from '../customCategories/actions';
import { authCheck } from '../auth/actions';
import { updateCompanyInfo } from '../company/actions';

import { makeQueryString } from '../../components/Helpers';
import getToken from '../getToken';

axios.defaults.timeout = 10000 * 10;

function token() {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };
}

function* loadSettingsCompany(action) {
  axios.defaults.timeout = 10000 * 10;
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/edit`, token());
    yield put(getSettingCompanySuccess(data));
  } catch (error) {
    console.log(error);
  }
}

function* editLangSettingsCompany(action) {
  try {
    yield call(axios.patch, `${config.api.url}/company/${action.id}/update-lang`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const companyInfo = yield select((state) => state.company.companyInfo);
    if (companyInfo.date_format !== action.data.date_format) {
      yield put(updateCompanyInfo({
        date_format: action.data.date_format,
      }));
    }

    // yield put(getSettingCompanySuccess(data));
    yield put(addSnackbar('Company language changed', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('Company edit error', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* editSettingsCompany(action) {
  try {
    yield call(axios.patch, `${config.api.url}/company/${action.id}/update`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const companyInfo = yield select((state) => state.company.companyInfo);
    if (companyInfo.date_format !== action.data.date_format) {
      yield put(updateCompanyInfo({
        date_format: action.data.date_format,
      }));
    }

    // yield put(getSettingCompanySuccess(data));
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
    yield put(getSettingWorkTimeSuccess(data));
  } catch (error) {
    console.log(error);
  }
}

function* editSettingsWorkTime(action) {
  try {
    const { data: { week_start, week_start_time, working_hours, hour_before_holiday, work_days } } = action;

    // eslint-disable-next-line no-unused-vars
    const { data } = yield call(axios.post,
      `${config.api.url}/company/${action.id}/work-time/update`, null,
      {
        data: {
          week_start,
          week_start_time,
          working_hours,
          hour_before_holiday,
          work_days,
        },
        ...token(),
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

function* getWorkingDays(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.companyId}/get-working-days/${action.year}`, token());
    yield put(getWorkingDaysSuccess(data));
  } catch (error) {
    console.log(error);
  }
}

function* getHolidays(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.companyId}/get-holidays/${action.year}`, token());
    yield put(getHolidaysSuccess(data));
  } catch (error) {
    console.log(error);
  }
}

function* addCompanyHoliday(action) {
  try {
    const { data } = yield call(axios.post,
      `${config.api.url}/company/${action.id}/work-time/holidays/create`, action.data, {
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
    // eslint-disable-next-line no-unused-vars
    const { data } = yield call(axios.delete,
      `${config.api.url}/company/${action.companyId}/work-time/holidays/delete/${action.id}`, token());
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
    yield put(loadSkillsSuccess(data.skills));
  } catch (e) {
    console.log(e);
  }
}

function* createSettingSkill(action) {
  try {
    const { data, status } = yield call(
      axios.post,
      `${config.api.url}/company/${action.id}/specialities/create`,
      action.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );

    if (status === 200) {
      yield put(addSnackbar(data.name[0], 'error'));
      yield delay(4000);
      yield put(dismissSnackbar());
      return;
    }

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
    // eslint-disable-next-line no-unused-vars
    const { data, status } = yield call(
      axios.post,
      `${config.api.url}/company/${action.id}/job-types/create`,
      action.data,
      token(),
    );

    if (status === 200) {
      yield put(addSnackbar(data.title[0], 'error'));
      yield delay(4000);
      yield put(dismissSnackbar());
      return;
    }

    yield put(getJobTypes(action.id));
    yield put(addSnackbar('Job creation successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Job', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}
function* patchJob(action) {
  try {
    const { data } = yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/job-types/update/${action.id}`,
      action.data,
      token(),
    );

    if (data.title?.[0]?.length > 1) {
      yield put(addSnackbar(data.title[0], 'error'));
      yield delay(4000);
      yield put(dismissSnackbar());
      return;
    }

    yield put(getJobTypes(action.companyId));
    yield put(addSnackbar('Updated job successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Job', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}
function* deleteJob(action) {
  try {
    yield call(
      axios.delete,
      `${config.api.url}/company/${action.companyId}/job-types/delete/${action.id}`,
      token(),
    );
    yield put(getJobTypes(action.companyId));
    yield put(addSnackbar('Removed job successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while delete Job', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* createPlace(action) {
  try {
    const { data, status } = yield call(
      axios.post,
      `${config.api.url}/company/${action.id}/places/create`,
      action.data,
      token(),
    );

    if (status === 200) {
      yield put(addSnackbar(data.name[0], 'error'));
      yield delay(4000);
      yield put(dismissSnackbar());
      return;
    }

    yield put(getPlaces(action.id));
    yield put(addSnackbar('Place creation successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Place', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}
function* patchPlace(action) {
  try {
    const { data } = yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/places/update/${action.id}`,
      action.data,
      token(),
    );

    if (data.name?.[0]?.length > 1) {
      yield put(addSnackbar(data.name[0], 'error'));
      yield delay(4000);
      yield put(dismissSnackbar());
      return;
    }

    yield put(getPlaces(action.companyId));
    yield put(addSnackbar('Updated place successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Place', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}
function* deletePlace(action) {
  try {
    yield call(
      axios.delete,
      `${config.api.url}/company/${action.companyId}/places/delete/${action.id}`,
      token(),
    );
    yield put(getPlaces(action.companyId));
    yield put(addSnackbar('Removed place successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Place', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* createCustomCategory(action) {
  try {
    const { data, status } = yield call(
      axios.post,
      `${config.api.url}/company/${action.id}/custom_categories/create`,
      action.data,
      token(),
    );

    if (status === 200) {
      yield put(addSnackbar(data.name[0], 'error'));
      yield delay(4000);
      yield put(dismissSnackbar());
      return;
    }

    yield put(getCustomCategories(action.id));
    yield put(addSnackbar('Additional categery creation successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Additional category', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}
function* patchCustomCategory(action) {
  try {
    const { data } = yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/custom_categories/update/${action.id}`,
      action.data,
      token(),
    );

    if (data.name?.[0]?.length > 1) {
      yield put(addSnackbar(data.name[0], 'error'));
      yield delay(4000);
      yield put(dismissSnackbar());
      return;
    }

    yield put(getCustomCategories(action.companyId));
    yield put(addSnackbar('Updated Additional category successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Additional category', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}
function* deleteCustomCategory(action) {
  try {
    yield call(
      axios.delete,
      `${config.api.url}/company/${action.companyId}/custom_categories/delete/${action.id}`,
      token(),
    );
    yield put(getCustomCategories(action.companyId));
    yield put(addSnackbar('Removed additiona category successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Additional category', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchSkill(action) {
  try {
    const { data } = yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/specialities/update/${action.id}`,
      action.data,
      token(),
    );

    if (data.name?.[0]?.length > 1) {
      yield put(addSnackbar(data.name[0], 'error'));
      yield delay(4000);
      yield put(dismissSnackbar());
      return;
    }

    yield put(loadSkills(action.companyId));
    yield put(addSnackbar('Updated skill successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Skill', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}
function* deleteSkill(action) {
  try {
    yield call(
      axios.delete,
      `${config.api.url}/company/${action.companyId}/specialities/delete/${action.id}`,
      token(),
    );
    yield put(loadSkills(action.companyId));
    yield put(addSnackbar('Removed skill successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Skill', 'error'));
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

function* loadCompanyCustomCategory(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/custom_categories`, token());
    yield put(loadCustomCategorySuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* loadCompanyShift(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/shifts`, token());
    yield put(loadShiftSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* loadCompanyJobType(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/job-types`, token());
    yield put(loadJobTypeSuccess(data));
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
    const tokens = token();
    const { data } = yield call(axios.get,
      `${config.api.url}/company/${action.id}/employees/all`,
      {
        params: action.params ? action.params : null,
        ...tokens,
      });

    if (action.params) {
      const employees = yield select((state) => state.settings.employees);
      yield put(loadEmployeesSuccess({
        stats: employees.stats,
        users: [...data.users],
      }));
    } else {
      yield put(loadEmployeesSuccess(data));
    }
  } catch (e) {
    console.log(e);
    yield put(loadEmployeesError());
  }
}

function* loadQueryEmployees(action) {
  try {
    const tokens = token();
    const { data } = yield call(axios.get,
      `${config.api.url}/company/${action.companyId}/employees/`,
      {
        params: makeQueryString(action.data),
        ...tokens,
      });
    // FIXME: awaiting backend
    yield put(loadEmployeesSuccess(data));
  } catch (e) {
    yield put(loadEmployeesError(e));
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
      },
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

function* loadJournalData(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/logbook/journal`, token());
    yield put(loadLogbookJournalSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* patchLogbookJournal(action) {
  try {
    yield call(axios.patch,
      `${config.api.url}/company/${action.id}/logbook/journal/store`, action.data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    // yield put(editLogbookJournalSuccess(data));
    yield put(addSnackbar('Edit Journal successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Journal', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadOvertimeData(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/logbook/overtime`, token());
    yield put(loadLogbookOvertimeSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* patchLogbookOvertime(action) {
  try {
    yield call(axios.patch,
      `${config.api.url}/company/${action.id}/logbook/overtime/store`, action.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    // yield put(editLogbookOvertimeSuccess(data));
    yield put(addSnackbar('Edit Overtime successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Overtime', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}


function* loadAdditionalRatesData(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/logbook/additional-rates`, token());
    yield put(loadLogbookAdditionalRatesSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* patchLogbookAdditionalRates(action) {
  try {
    const { data } = yield call(axios.patch,
      `${config.api.url}/company/${action.id}/logbook/additional-rates/store`, action.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    
    yield put(editLogbookAdditionalRatesSuccess(data));
    yield put(addSnackbar('Edit Additional rates successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Additional rates', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadClockData(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/logbook/clock`, token());
    yield put(loadLogbookClockSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* patchLogbookClock(action) {
  try {
    const { data } = yield call(axios.patch,
      `${config.api.url}/company/${action.id}/logbook/clock/store`, action.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    
    yield put(editLogbookClockSuccess(data));
    yield put(addSnackbar('Edit Clock successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Clock', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadAutoDeleteData(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/deletedata/autodelete`, token());
    yield put(loadAutoDeleteSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* patchAutoDelete(action) {
  try {
    const { data } = yield call(axios.patch,
      `${config.api.url}/company/${action.id}/deletedata/autodelete/store`, action.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    
    yield put(editAutoDeleteSuccess(data));
    yield put(addSnackbar('Edit Data successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Data', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadTimeSheetData(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/time-sheet`, token());
    yield put(loadTimeSheetSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* patchTimeSheet(action) {
  try {
    yield call(axios.patch,
      `${config.api.url}/company/${action.id}/time-sheet/store`, action.data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    // yield put(editTimeSheetSuccess(data));
    yield put(addSnackbar('Edit Time Sheet successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while editing Time Sheet', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadIntegrationsData(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/integrations`, token());
    yield put(loadIntegrationsSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* patchIntegrations(action) {
  try {
    yield call(axios.patch,
      `${config.api.url}/company/${action.id}/integrations/store`, action.data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

    yield put(addSnackbar('Edit Integrations successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while editing Integrations', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadAccountGroups(action) {
  try {
    const { data } = yield call(
      axios.get, `${config.api.url}/company/${action.id}/groups`, token(),
    );
    yield put(getAccountGroupsSuccess(data));
  } catch (e) {
    yield put(addSnackbar('An error occurred while getting Groups', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* createAccountGroup(action) {
  try {
    const { data } = yield call(
      axios.post, `${config.api.url}/company/${action.id}/groups/create`, {
        ...action.data,
        company_id: action.id,
      }, token(),
    );
    yield put(createAccountGroupSuccess(data));
    yield put(addSnackbar('Added Group successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(createAccountGroupError());
    yield put(addSnackbar('An error occurred while adding new Group', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* createAccountSubgroup(action) {
  try {
    // eslint-disable-next-line camelcase
    const {
      data: {
        parentGroupId,
        name,
      },
    } = action;
    const { data } = yield call(
      axios.post, `${config.api.url}/company/${action.companyId}/groups/create`, {
        companyId: action.companyId,
        parent_group_id: parentGroupId,
        name,
      }, token(),
    );

    const Groups = yield select((state) => state.settings.groups);

    const groups = Groups.map((grp) => {
      if (grp.id === parentGroupId) {
        if (grp.subgroups) {
          grp.subgroups.push(data);
        } else {
          // eslint-disable-next-line no-param-reassign
          grp.subgroups = [data];
        }
      }
      return grp;
    });

    yield put(createAccountSubgroupSuccess(groups));
    yield put(addSnackbar('Added Group successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while adding new Sub-group', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* deleteAccountGroup(action) {
  const { subgroup } = action;
  try {
    const headers = token();

    const { data } = yield call(axios.delete,
      `${config.api.url}/company/${action.id}/groups/delete/${action.groupId}`,
      {
        data: subgroup ? { subgroup } : undefined,
        ...headers,
      });
    if (data.message === 'Deleted') {
      const stateGroups = yield select((state) => state.settings.groups) ?? [];
      let groups = [];

      if (subgroup) {
        groups = stateGroups.map((group) => {
          const subgroups = group.subgroups.filter((sbgrp) => sbgrp.id !== subgroup);
          return {
            ...group,
            subgroups,
          };
        });
        yield put(removeAccountSubgroupSuccess());
      } else {
        groups = stateGroups.filter((group) => group.id !== action.groupId);
      }
      yield put(removeAccountGroupSuccess([...groups]));
      yield put(addSnackbar(`Removed ${subgroup ? 'Sub-group' : 'Group'} successfully`, 'success'));
      yield delay(4000);
      yield put(dismissSnackbar());
    } else {
      yield put(subgroup ? removeAccountSubgroupError() : removeAccountGroupError());
    }
  } catch (e) {
    yield put(subgroup ? removeAccountSubgroupError() : removeAccountGroupError());

    yield put(addSnackbar(`An error occurred while remove ${subgroup ? 'Sub-group' : 'Group'}`, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchAccountGroup(action) {
  const {
    subgroup,
    type: $,
    ...rest
  } = action;
  try {
    const { data } = yield call(axios.patch,
      `${config.api.url}/company/${action.companyId}/groups/update/${action.id}`,
      { subgroup, ...rest }, token());
    const Groups = yield select((state) => state.settings.groups);
    let groups = [];

    if (subgroup) {
      groups = Groups.map((group) => {
        const subgroups = group.subgroups?.map((sbgrp) => {
          if (sbgrp.id === action.id) {
            return { ...data };
          }
          return sbgrp;
        });
        return {
          ...group,
          subgroups,
        };
      });
    } else {
      groups = Groups.map((group) => {
        if (group.id === action.id) {
          return {
            ...group,
            ...data,
          };
        }
        return group;
      });
    }

    yield put(editAccountGroupSuccess(groups));
    if (subgroup) {
      yield put(editAccountSubgroupSuccess());
    }
  } catch (e) {
    yield put(subgroup ? editAccountSubgroupError() : editAccountGroupError());
    yield put(addSnackbar(`An error occurred while edit ${subgroup ? 'Sub-group' : 'Group'}`, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadRoles(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.companyId}/account-roles`, token());
    yield put(getRolesSuccess(data));
  } catch (e) {
    yield put(getRolesError(e));
  }
}

function* createRole(action) {
  try {
    const {
      companyId,
      name,
    } = action;

    const { data } = yield call(axios.post,
      `${config.api.url}/company/${companyId}/account-roles/store`, {
        name,
      }, token());

    const roles = yield select((state) => state.settings.roles ?? []);
    yield put(createRoleSuccess([...roles, {
      ...data,
      default: 0,
      can_delete: 1,
      accountUserRoles: [],
      accountRolesPermissions: [],
    }]));
    yield put(addSnackbar('Added Role successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(createRoleError(e));
    yield put(addSnackbar('An error occurred while removing Role', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* removeRole(action) {
  try {
    const { data } = yield call(axios.delete,
      `${config.api.url}/company/${action.companyId}/account-roles/delete/${action.roleId}`,
      token());
    if (data.message?.toLowerCase() === 'deleted') {
      const roles = yield select((state) => state.settings.roles);
      yield put(deleteRoleSuccess([...roles.filter((role) => role.id !== action.roleId)]));
    }
    yield put(addSnackbar('Removed Role successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(deleteRoleError(e));
    yield put(addSnackbar('An error occurred while removing Role', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchRole(action) {
  try {
    const tokens = token();

    const { data: { permissions, name, users }, roleId } = action;

    const roles = yield select((state) => state.settings.roles ?? []);
    // const newPermissions = yield select((state) => state.settings.permissions ?? []);
    // const userRoleId = yield select((state) => state.auth.user.user.role_id ?? []);

    if (permissions) {
      // eslint-disable-next-line no-unused-vars
      const { data } = yield call(axios.patch,
        `${config.api.url}/company/${action.companyId}/account-roles/update/${roleId}`,
        null,
        {
          params: { permissions: JSON.stringify(permissions) },
          ...tokens,
        });
        
      // console.log('permissions = ', permissions);
      // console.log('permissions = ', newPermissions);
      // console.log('action = ', action);
      // console.log('roleId = ', roleId);
      // console.log('userRoleId = ', userRoleId);
      yield put(authCheck());
      yield put(getRolesSuccess(roles.map((role) => (role.id === roleId ? { ...role, data } : role))));
    } else {
      // eslint-disable-next-line no-unused-vars
      const { data } = yield call(axios.patch,
        `${config.api.url}/company/${action.companyId}/account-roles/update/${roleId}`,
        null,
        {
          params: { ...action.data },
          ...tokens,
        });

      if (action.data.default || action.data.name || typeof users !== 'string') {
        yield put(updateRoleSuccess(
          roles.map((role) => {
            if (action.data.default) {
              if (role.id !== action.roleId && role.default) {
                return {
                  ...role,
                  default: 0,
                };
              }
              if (role.id === action.roleId) {
                return {
                  ...role,
                  default: 1,
                };
              }
            }

            if (name && role.id === action.roleId) {
              return { ...role, name };
            }

            if (role.id === action.roleId) {
              return {
                ...role, ...data,
              };
            }

            return role;
          }),
        ));

        
      } else {
        yield put(getRoles(action.companyId));
      }
    }

    yield put(addSnackbar('Updated Role successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(updateRoleError(e));
    yield put(addSnackbar('An error occurred while updating Role', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}


function* loadTimeOffs(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.companyId}/time-off`, token());
    yield put(getTimeOffsSuccess(data));
  } catch (e) {
    yield put(getTimeOffsError(e));
  }
}

function* createTimeOff(action) {
  try {
    const {
      companyId,
      data,
    } = action;

    yield call(axios.post,
      `${config.api.url}/company/${companyId}/time-off/store`, data, token());

    yield put(getTimeOffs(companyId));
    yield put(addSnackbar('Added Time Off successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(createTimeOffError(e));
    yield put(addSnackbar('An error occurred while removing Time Off', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* removeTimeOff(action) {
  try {
    const { data } = yield call(axios.delete,
      `${config.api.url}/company/${action.companyId}/time-off/${action.timeOffId}/delete`,
      token());
    if (data.message?.toLowerCase() === 'deleted') {
      yield put(getTimeOffs(action.companyId));
    }
    yield put(addSnackbar('Removed Time Off successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(deleteTimeOffError(e));
    yield put(addSnackbar('An error occurred while removing Time Off', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchTimeOff(action) {
  try {
    const { data, timeOffId } = action;

    const time_offs = yield select((state) => state.settings.time_offs ?? []);
    
    // eslint-disable-next-line no-unused-vars
    const { data: responseData } = yield call(axios.patch,
      `${config.api.url}/company/${action.companyId}/time-off/${timeOffId}/update`,
      data,
      token());

    yield put(updateTimeOffSuccess(time_offs.map((time_off) => (time_off.id === timeOffId ? { ...responseData } : time_off))));
    //yield put(getTimeOffsSuccess(time_offs.map((time_off) => (time_off.id === timeOffId ? { ...time_off, responseData } : time_off))));
  
    //yield put(getTimeOffs(action.companyId));

    yield put(addSnackbar('Updated Time Off successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(updateTimeOffError(e));
    yield put(addSnackbar('An error occurred while updating Time Off', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}


function* loadPolicies(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.companyId}/time-off/${action.timeOffId}/policy`, token());
    yield put(getPoliciesSuccess(data));
  } catch (e) {
    yield put(getPoliciesError(e));
  }
}

function* createPolicy(action) {
  try {
    const {
      companyId,
      timeOffId,
      data,
    } = action;

    yield call(axios.post,
      `${config.api.url}/company/${companyId}/time-off/${timeOffId}/policy/store`, data, token());

    yield put(getPolicies(companyId, timeOffId));
    yield put(addSnackbar('Added Policy successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(createPolicyError(e));
    yield put(addSnackbar('An error occurred while removing Policy', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* removePolicy(action) {
  try {
    const { data } = yield call(axios.delete,
      `${config.api.url}/company/${action.companyId}/time-off/${action.timeOffId}/policy/${action.policyId}/delete`,
      token());
    if (data.message?.toLowerCase() === 'deleted') {
      yield put(getPolicies(action.companyId, action.timeOffId));
    }
    yield put(addSnackbar('Removed Policy successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(deletePolicyError(e));
    yield put(addSnackbar('An error occurred while removing Policy', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchPolicy(action) {
  try {
    const { data, timeOffId, policyId } = action;

    const policies = yield select((state) => state.settings.policies ?? []);
    
    // eslint-disable-next-line no-unused-vars
    const { responseData } = yield call(axios.patch,
      `${config.api.url}/company/${action.companyId}/time-off/${timeOffId}/policy/${policyId}/update`,
      data,
      token());

    yield put(authCheck());
    yield put(getPoliciesSuccess(policies.map((policy) => (policy.id === policyId ? { ...policy, responseData } : policy))));
  
    yield put(getPolicies(action.companyId, timeOffId));

    yield put(addSnackbar('Updated Policy successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(updatePolicyError(e));
    yield put(addSnackbar('An error occurred while updating Policy', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchPolicySettings(action) {
  try {
    const { data, timeOffId, policyId } = action;

    const policies = yield select((state) => state.settings.policies ?? []);
    const time_offs = yield select((state) => state.settings.time_offs ?? []);
    
    // eslint-disable-next-line no-unused-vars
    const { data: responseData } = yield call(axios.patch,
      `${config.api.url}/company/${action.companyId}/time-off/${timeOffId}/policy/${policyId}/update-settings`,
      data,
      token());

    //yield put(authCheck());
    yield put(updatePolicySettingsSuccess(policies.map((policy) => (policy.id === policyId ? { ...policy, ...responseData } : policy))));
    yield put(updateTimeOffSuccess(time_offs.map((time_off) => (time_off.id === timeOffId ? { ...time_off, policies: time_off.policies.map((policy) => (policy.id === policyId ? { ...responseData } : policy)) } : time_off))));

    //yield delay(4000);
    //yield put(dismissSnackbar());
  } catch (e) {
    yield put(updatePolicySettingsError(e));
    yield put(addSnackbar('An error occurred while updating Policy', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchPolicyEmployees(action) {
  try {
    const { data, timeOffId, policyId } = action;

    const policies = yield select((state) => state.settings.policies ?? []);
    const time_offs = yield select((state) => state.settings.time_offs ?? []);
    
    // eslint-disable-next-line no-unused-vars
    const { data: responseData } = yield call(axios.patch,
      `${config.api.url}/company/${action.companyId}/time-off/${timeOffId}/policy/${policyId}/update-employees`,
      data,
      token());

    //yield put(authCheck());
    yield put(updatePolicySettingsSuccess(policies.map((policy) => (policy.id === policyId ? { ...policy, ...responseData } : policy))));
    yield put(updateTimeOffSuccess(time_offs.map((time_off) => (time_off.id === timeOffId ? { ...time_off, policies: time_off.policies.map((policy) => (policy.id === policyId ? { ...responseData } : policy)) } : time_off))));

    //yield delay(4000);
    //yield put(dismissSnackbar());
  } catch (e) {
    yield put(updatePolicySettingsError(e));
    yield put(addSnackbar('An error occurred while updating Policy', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* duplicatePolicy(action) {
  try {
    const { data, timeOffId, policyId } = action;

    const policies = yield select((state) => state.settings.policies ?? []);
    
    // eslint-disable-next-line no-unused-vars
    const { responseData } = yield call(axios.post,
      `${config.api.url}/company/${action.companyId}/time-off/${timeOffId}/policy/${policyId}/duplicate`,
      data,
      token());

    yield put(authCheck());
    yield put(getPoliciesSuccess(policies.map((policy) => (policy.id === policyId ? { ...policy, responseData } : policy))));
  
    yield put(getPolicies(action.companyId, timeOffId));

    yield put(addSnackbar('Duplicated Policy successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(duplicatePolicyError(e));
    yield put(addSnackbar('An error occurred while duplicating Policy', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* createRequestBehalf(action) {
  try {
    const {
      companyId,
      timeOffId,
      policyId,
      data,
    } = action;

    yield call(axios.post,
      `${config.api.url}/company/${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/store`, data, token());

    yield put(getRequestBehalf(companyId, timeOffId, policyId, data.employees[0]));

    yield put(addSnackbar('Added Request Behalf successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(createRequestBehalfError(e));
    yield put(addSnackbar('An error occurred while adding Request Behalf', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* updateRequestBehalf(action) {
  try {
    const {
      companyId,
      timeOffId,
      policyId,
      data,
      requestBehalfId
    } = action;

    yield call(axios.post,
      `${config.api.url}/company/${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/${requestBehalfId}`, data, token());

    yield put(getRequestBehalf(companyId, timeOffId, policyId, data.employees[0]));

    yield put(addSnackbar('Updated Request Behalf successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(updateRequestBehalfError(e));
    yield put(addSnackbar('An error occurred while update Request Behalf', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* changeRequestBehalfStatus(action) {
  try {
    const {
      companyId,
      timeOffId,
      policyId,
      requestBehalfId,
      data,
    } = action;

    yield call(axios.post,
      `${config.api.url}/company/${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/${requestBehalfId}/status`, data, token());

    yield put(getRequestBehalf(companyId, timeOffId, policyId, data.employees[0]));

    yield put(addSnackbar('Updated Request Behalf successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(changeRequestBehalfStatusError(e));
    yield put(addSnackbar('An error occurred while update Request Behalf', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadRequestBehalf(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.companyId}/time-off/${action.timeOffId}/policy/${action.policyId}/request-behalf/employee/${action.employeeId}`, token());
    yield put(getRequestBehalfSuccess(data));
  } catch (e) {
    yield put(getRequestBehalfError(e));
  }
}

function* createAdjustBalance(action) {
  try {
    const {
      companyId,
      timeOffId,
      policyId,
      data,
    } = action;

    yield call(axios.post,
      `${config.api.url}/company/${companyId}/time-off/${timeOffId}/policy/${policyId}/adjust-balance/store`, data, token());

    yield put(addSnackbar('Added Adjust Balance successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(createAdjustBalanceError(e));
    yield put(addSnackbar('An error occurred while removing Adjust Balance', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* createAdjustTimeUsed(action) {
  try {
    const {
      companyId,
      timeOffId,
      policyId,
      data,
    } = action;

    yield call(axios.post,
      `${config.api.url}/company/${companyId}/time-off/${timeOffId}/policy/${policyId}/adjust-time-used/store`, data, token());

    yield put(addSnackbar('Added Adjust Time Used successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(createAdjustTimeUsedError(e));
    yield put(addSnackbar('An error occurred while removing Adjust Time Used', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* getEmployeeEdit(action) {
  try {
    const { data } = yield call(axios.get,
      `${config.api.url}/company/${action.id}/employees/edit/${action.employeeId}`,
      token());
    yield put(loadEmployeesEditSuccess(data));
  } catch (e) {
    console.log(e);
    yield put(loadEmployeesEditError());
  }
}

function* updateEmployee(action) {
  try {
    yield call(
      axios.patch,
      `${config.api.url}/company/${action.id}/employees/update/${action.employeeId}`,
      action.data,
      token(),
    );

    yield put(loadEmployeesAll(action.id));
    // }
  } catch (e) {
    yield put(patchEmployeeError(e));
    yield put(addSnackbar('An error occurred while edit account', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* updateEmployeeLogbook(action) {
  try {
    yield call(
      axios.patch,
      `${config.api.url}/company/${action.id}/employees/update-logbook/${action.employeeId}`,
      action.data,
      token(),
    );
    // }
  } catch (e) {
    yield put(patchEmployeeLogbookError(e));
    yield put(addSnackbar('An error occurred while edit account', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* loadCurrencies() {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/currencies`, token());
    yield put(getCurrenciesSuccess(data));
  } catch (e) {
    console.log(e);
  }
}

function* deleteEmployee(action) {
  try {
    const { data } = yield call(
      axios.delete,
      `${config.api.url}/company/${action.companyId}/employees/delete/${action.employeeId}`,
      token(),
    );
    if (data.message === 'Deleted') {
      yield put(removeEmployeeSuccess());
      yield put(loadEmployeesAll(action.companyId));
    }
    yield put(addSnackbar('Removed employee successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(removeEmployeeError(e));
    yield put(addSnackbar('An error occurred while remove employee', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* setEmployeesActions(action) {
  try {
    const headers = token();
    // eslint-disable-next-line no-unused-vars
    const { data } = yield call(axios.post,
      `${config.api.url}/company/${action.companyId}/employees/mass-action`, null, {
        params: {
          users: JSON.stringify(action.employeesIds.map((id) => ({ id }))),
          action: action.status,
        },
        ...headers,
      });

    yield put(loadEmployeesAll(action.companyId));
    yield put(addSnackbar(action.status === 'reset_password' ? 'Password reset email sent' : 'Changed status successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(setEmployeesActionsError(e));
    yield put(addSnackbar('An error occurred while changing employee\'s status', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* createEmployee(action) {
  try {
    const {
      companyId,
      userData: {
        group,
        subgroup,
        place,
        skill,
        ...rest
      },
    } = action;
    const { data } = yield call(axios.post,
      `${config.api.url}/company/${companyId}/employees/store`,
      {
        ...rest,
        place_id: place,
        company_id: companyId,
      }, token());

    if (data.email[0].length > 2) {
      yield put(addSnackbar(data.email[0], 'error'));
      yield delay(4000);
      yield put(dismissSnackbar());
      return;
    }

    const { id } = data;

    if (id) {
      if (place) {
        // eslint-disable-next-line no-use-before-define
        yield call(assignPlace, {
          companyId,
          employeeId: id,
          place,
        });
      }

      if (group && !subgroup) {
        // eslint-disable-next-line no-use-before-define
        yield call(assignGroup, {
          companyId,
          group,
          employeeId: id,
        });
      }

      if (subgroup) {
        // eslint-disable-next-line no-use-before-define
        yield call(assignGroup, {
          companyId,
          group,
          subgroup,
          employeeId: id,
        });
      }

      if (skill) {
        // eslint-disable-next-line no-use-before-define
        yield call(assignSkill, {
          companyId,
          skill,
          employeeId: id,
        });
      }
    }

    if (data) {
      yield put(loadEmployeesAll(companyId));
    }
    yield put(loadEmployeesAll(action.companyId));
    yield put(addSnackbar('Employee added successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(createEmployeeError(e));
    yield put(addSnackbar('An error occurred while adding employee - '+e.response.data.message, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* assignPlace({
  companyId,
  employeeId,
  place,
}) {
  try {
    const employee = yield select((state) => state.settings.employee);
    const oldPlaceId = employee?.place?.[0]?.id;

    if (place !== oldPlaceId) {
    // eslint-disable-next-line no-unused-vars,no-shadow
      const { data } = yield call(axios.post,
        `${config.api.url}/company/${companyId}/employees/assign-place`, {
          employee_id: employeeId,
          place_id: parseInt(place, 10),
        }, token());
    }
  } catch (e) {
    console.log(e);
  }
}

function* assignGroup({
  companyId,
  group,
  employeeId,
  subgroup = null,
}) {
  try {
    const groupId = parseInt(group, 10);
    const subgroupId = parseInt(subgroup, 10);

    const payload = !subgroup
      ? {
        group_id: groupId,
        employee_id: employeeId,
      }
      : {
        employee_id: employeeId,
        parent_group_id: groupId,
        group_id: subgroupId,
        subgroup: true,
      };

    const employee = yield select((state) => state.settings.employee);
    const oldGroupId = employee?.groups?.[0]?.id;
    const oldSubGroupId = employee?.subgroups?.[0]?.id;
    const oldSubGroupParentId = employee?.subgroups?.[0]?.parent_group_id;

    if (oldGroupId) {
      if (groupId !== oldGroupId || subgroup) {
        // eslint-disable-next-line no-use-before-define
        yield call(detachGroup, { companyId, group: oldGroupId, employeeId });
      }
    }

    if (oldSubGroupId) {
      if ((!Number.isNaN(subgroupId) && subgroupId !== oldSubGroupId) || !subgroup) {
        // eslint-disable-next-line no-use-before-define
        yield call(detachGroup, {
          companyId, group: oldSubGroupParentId, employeeId, subgroup: oldSubGroupId,
        });
      }
    }
    if (group || subgroup) {
      if ((!subgroup && groupId !== oldSubGroupId) || (subgroup && subgroupId !== oldSubGroupId)) {
        // eslint-disable-next-line no-unused-vars,no-shadow
        const { data } = yield call(axios.post,
          `${config.api.url}/company/${companyId}/employees/assign-group`, payload, token());
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function* assignSkill({
  companyId,
  skill,
  employeeId,
}) {
  try {
    const employee = yield select((state) => state.settings.employee);
    const oldSkillId = employee?.skills?.[0]?.id;
    if (skill !== oldSkillId) {
    // eslint-disable-next-line no-unused-vars,no-shadow
      const { data } = yield call(axios.post,
        `${config.api.url}/company/${companyId}/employees/assign-skill`, {
          employee_id: employeeId,
          skill_id: skill,
        }, token());
    }
  } catch (e) {
    console.log(e);
  }
}

function* detachGroup({
  companyId,
  group,
  employeeId,
  subgroup = null,
}) {
  const payload = !subgroup
    ? {
      group_id: parseInt(group, 10),
      employee_id: employeeId,
    }
    : {
      employee_id: employeeId,
      parent_group_id: parseInt(group, 10),
      group_id: parseInt(subgroup, 10),
      subgroup: true,
    };
  try {
    // eslint-disable-next-line no-unused-vars,no-shadow
    const { data } = yield call(axios.post,
      `${config.api.url}/company/${companyId}/employees/detach-group`, payload, token());
  } catch (e) {
    console.log(e);
  }
}

function* loadPermissions({ companyId }) {
  try {
    const { data } = yield call(axios.get,
      `${config.api.url}/company/${companyId}/account-roles/permissions`, token());
    yield put(loadPermissionsSuccess(data));
  } catch (e) {
    yield put(loadPermissionsError(e));
  }
}

function* showSnackBar({ message, snackbarType }) {
  try {
    yield put(addSnackbar(message, snackbarType));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    console.log(e);
  }
}

function* sendImportedEmployees(action) {
  try {
    const { companyId, data: { users, createMissing, updateCurrent } } = action;

    const { data } = yield call(
      axios.post,
      `${config.api.url}/company/${companyId}/employees/import-store`,
      { users },
      {
        params: {
          create_missing: createMissing,
          update_current: updateCurrent,
        },
        ...token(),
        timeout: 0,
      },
    );

    yield put(sendImportedEmployeesSuccess(data));
  } catch (e) {
    yield call(showSnackBar,
      {
        message: 'An error occurred while importing employee',
        snackbarType: 'error',
      });
  }
}

function* sendImportedPlaces(action) {
  try {
    const { companyId, data: { places, updateCurrent } } = action;

    const { data } = yield call(
      axios.post,
      `${config.api.url}/company/${companyId}/places/import-store`,
      { places },
      {
        params: {
          update_current: updateCurrent,
        },
        ...token(),
        timeout: 0,
      },
    );
    
    yield put(sendImportedPlacesSuccess(data));
  } catch (e) {
    yield call(showSnackBar,
      {
        message: 'An error occurred while importing places',
        snackbarType: 'error',

      });
  }
}

function* changePassword(action) {
  try {
    const { data } = yield call(axios.patch,
      `${config.api.url}/company/${action.companyId}/employees/update-password/${action.employeeId}`,
      action.data,
      token());

    yield put(changePasswordSuccess(data));
    yield call(showSnackBar, {
      message: 'Password was successfully changed',
      snackbarType: 'success',
    });
  } catch (e) {
    yield put(changePasswordError(e));
    yield call(showSnackBar, {
      message: 'An error occurred while changing password',
      snackbarType: 'error',
    });
  }
}

/* events */
function* getEvents(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/events`,
      token(),
    );
    yield put(getEventsSuccess(data));
  } catch (e) {
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* postEvent(action) {
  try {
    const { data } = yield call(
      axios.post,
      `${config.api.url}/company/${action.companyId}/events/store`,
      action.data,
      token(),
    );
    yield put(postEventSuccess(data));
    yield put(addSnackbar('Create event successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchEvent(action) {
  try {
    const { data } = yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/events/update/${action.id}`,
      action.data,
      token(),
    );
    yield put(patchEventSuccess(data, action.data.employees));
    yield put(addSnackbar('Update event successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
    // yield put(postLogbookEntrySuccess(data));
  } catch (e) {
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* deleteEvent(action) {
  try {
    yield call(
      axios.delete,
      `${config.api.url}/company/${action.companyId}/events/delete/${action.id}`,
      token(),
    );
    yield put(deleteEventSuccess(action.id));
    yield put(addSnackbar('Update event successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

/* schedule */
function* getSchedule(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/schedule/settings`,
      getToken(),
    );
    yield put(getScheduleSuccess(data));
  } catch (e) {
    yield put(getScheduleError());
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* postSchedule(action) {
  try {
    yield call(
      axios.post,
      `${config.api.url}/company/${action.companyId}/schedule/settings/edit`,
      action.data,
      getToken(),
    );
    yield put(addSnackbar('Schedule parameters edited successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export default function* SettingsWatcher() {
  yield takeLeading(PATCH_JOB, patchJob);
  yield takeLeading(DELETE_JOB, deleteJob);
  yield takeLeading(PATCH_PLACE, patchPlace);
  yield takeLeading(DELETE_PLACE, deletePlace);
  yield takeLeading(PATCH_CUSTOM_CATEGORY, patchCustomCategory);
  yield takeLeading(DELETE_CUSTOM_CATEGORY, deleteCustomCategory);
  yield takeLeading(PATCH_SKILL, patchSkill);
  yield takeLeading(DELETE_SKILL, deleteSkill);
  yield takeLeading(GET_SETTINGS_COMPANY, loadSettingsCompany);
  yield takeLatest(PATCH_LANG_SETTINGS_COMPANY, editLangSettingsCompany);
  yield takeLatest(PATCH_SETTINGS_COMPANY, editSettingsCompany);
  yield takeLeading(GET_SETTINGS_WORK_TIME, loadSettingsWorkTime);
  yield takeLeading(GET_WORKING_DAYS, getWorkingDays);
  yield takeLeading(GET_HOLIDAYS, getHolidays);
  yield takeLatest(PATCH_WORK_TIME, editSettingsWorkTime);
  yield takeLatest(ADD_HOLIDAY, addCompanyHoliday);
  yield takeLatest(DELETE_HOLIDAY, deleteCompanyHoliday);
  yield takeLeading(GET_SECURITY_COMPANY, loadSecurityCompany);
  yield takeLatest(PATCH_SECURITY_COMPANY, changeSecurityCompany);
  yield takeLeading(GET_SETTINGS_SKILLS, loadSettingsSkills);
  yield takeLatest(CREATE_SKILL, createSettingSkill);
  yield takeLatest(CREATE_JOB, creacteJob);
  yield takeLatest(CREATE_PLACE, createPlace);
  yield takeLeading(GET_PLACE, loadCompanyPLace);
  yield takeLatest(CREATE_CUSTOM_CATEGORY, createCustomCategory);
  yield takeLeading(GET_CUSTOM_CATEGORY, loadCompanyCustomCategory);
  yield takeLeading(GET_COMPANY_SHIFT, loadCompanyShift);
  yield takeLeading(GET_COMPANY_JOB_TYPE, loadCompanyJobType);
  yield takeLatest(GET_ACTIVITY_LOG, loadActivityLog);
  yield takeLeading(GET_SETTINGS_EMPLOYEES, loadEmployee);
  yield takeLeading(GET_SETTINGS_EMPLOYEES_ALL, loadEmployee);
  yield takeLatest(GET_SETTINGS_EMPLOYEES_QUERY, loadQueryEmployees);
  yield takeLatest(FILTER_ACTIVITY_LOG, filterActivityLog);
  yield takeLeading(GET_DELETE_DATA, loadDeleteData);
  yield takeLatest(DELETE_DATA, deleteCompanyData);
  yield takeLeading(GET_LOGBOOK_JOURNAL, loadJournalData);
  yield takeLatest(EDIT_LOGBOOK_JOURNAL, patchLogbookJournal);
  yield takeLeading(GET_LOGBOOK_OVERTIME, loadOvertimeData);
  yield takeLatest(EDIT_LOGBOOK_OVERTIME, patchLogbookOvertime);
  yield takeLeading(GET_LOGBOOK_ADDITIONAL_RATES, loadAdditionalRatesData);
  yield takeLatest(EDIT_LOGBOOK_ADDITIONAL_RATES, patchLogbookAdditionalRates);
  yield takeLeading(GET_LOGBOOK_CLOCK, loadClockData);
  yield takeLatest(EDIT_LOGBOOK_CLOCK, patchLogbookClock);
  yield takeLeading(GET_AUTO_DELETE, loadAutoDeleteData);
  yield takeLatest(EDIT_AUTO_DELETE, patchAutoDelete);
  yield takeLeading(GET_TIME_SHEET, loadTimeSheetData);
  yield takeLatest(EDIT_TIME_SHEET, patchTimeSheet);
  yield takeLeading(GET_INTEGRATIONS, loadIntegrationsData);
  yield takeLatest(EDIT_INTEGRATIONS, patchIntegrations);
  yield takeLeading(GET_ACCOUNTS_GROUPS, loadAccountGroups);
  yield takeLatest(CREATE_ACCOUNTS_GROUP, createAccountGroup);
  yield takeLatest(CREATE_ACCOUNTS_SUBGROUP, createAccountSubgroup);
  yield takeLatest(DELETE_ACCOUNTS_GROUP, deleteAccountGroup);
  yield takeLatest(DELETE_ACCOUNTS_SUBGROUP, deleteAccountGroup);
  yield takeLatest(PATCH_ACCOUNTS_GROUP, patchAccountGroup);
  yield takeLatest(PATCH_ACCOUNTS_SUBGROUP, patchAccountGroup);
  yield takeLatest(GET_SETTINGS_EMPLOYEES_EDIT, getEmployeeEdit);
  yield takeLatest(UPDATE_EMPLOYEE, updateEmployee);
  yield takeLatest(UPDATE_EMPLOYEE_LOGBOOK, updateEmployeeLogbook);
  yield takeLeading(GET_CURRENCY, loadCurrencies);
  yield takeLatest(DELETE_EMPLOYEE, deleteEmployee);
  yield takeLatest(EMPLOYEE_ACTIONS, setEmployeesActions);
  yield takeLatest(CREATE_EMPLOYEE, createEmployee);
  yield takeLeading(GET_ROLES, loadRoles);
  yield takeLatest(CREATE_ROLE, createRole);
  yield takeLatest(DELETE_ROLE, removeRole);
  yield takeLatest(UPDATE_ROLE, patchRole);
  yield takeLeading(GET_TIME_OFFS, loadTimeOffs);
  yield takeLatest(CREATE_TIME_OFF, createTimeOff);
  yield takeLatest(DELETE_TIME_OFF, removeTimeOff);
  yield takeLatest(UPDATE_TIME_OFF, patchTimeOff);
  yield takeLeading(GET_POLICIES, loadPolicies);
  yield takeLatest(CREATE_POLICY, createPolicy);
  yield takeLatest(DELETE_POLICY, removePolicy);
  yield takeLatest(UPDATE_POLICY, patchPolicy);
  yield takeLatest(UPDATE_POLICY_SETTINGS, patchPolicySettings);
  yield takeLatest(UPDATE_POLICY_EMPLOYEES, patchPolicyEmployees);
  yield takeLatest(DUPLICATE_POLICY, duplicatePolicy);
  yield takeLatest(CREATE_REQUEST_BEHALF, createRequestBehalf);
  yield takeLatest(UPDATE_REQUEST_BEHALF, updateRequestBehalf);
  yield takeLatest(CHANGE_REQUEST_BEHALF_STATUS, changeRequestBehalfStatus);
  yield takeLatest(GET_REQUEST_BEHALF, loadRequestBehalf);
  yield takeLatest(CREATE_ADJUST_BALANCE, createAdjustBalance);
  yield takeLatest(CREATE_ADJUST_TIME_USED, createAdjustTimeUsed);
  yield takeLeading(LOAD_PERMISSIONS, loadPermissions);
  yield takeLatest(ADD_INFO_SETTING_SNACKBAR, showSnackBar);
  yield takeLatest(SEND_IMPORTED_EMPLOYEES, sendImportedEmployees);
  yield takeLatest(SEND_IMPORTED_PLACES, sendImportedPlaces);
  yield takeLeading(CHANGE_PASSWORD, changePassword);
  yield takeLatest(GET_EVENTS, getEvents);
  yield takeLatest(POST_EVENT, postEvent);
  yield takeLatest(PATCH_EVENT, patchEvent);
  yield takeLatest(DELETE_EVENT, deleteEvent);
  yield takeLatest(GET_SETTINGS_SCHEDULE, getSchedule);
  yield takeLatest(POST_SETTINGS_SCHEDULE, postSchedule);
}
