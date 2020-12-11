/* eslint-disable camelcase */
import {
  call, put, takeLatest, delay, select,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';
import {
  GET_SETTINGS_COMPANY,
  PATCH_SETTINGS_COMPANY,
  GET_WORK_TIME,
  PATCH_WORK_TIME,
  ADD_HOLIDAY,
  DELETE_HOLIDAY,
  GET_SECURITY_COMPANY,
  PATCH_SECURITY_COMPANY,
  GET_SKILLS,
  CREATE_SKILL,
  CREATE_JOB,
  CREATE_PLACE,
  GET_PLACE,
  GET_ACTIVITY_LOG,
  GET_EMPLOYEES,
  FILTER_ACTIVITY_LOG,
  GET_DELETE_DATA,
  DELETE_DATA,
  GET_LOGBOOK_JOURNAL,
  EDIT_LOGBOOK_JOURNAL,
  GET_LOGBOOK_OVERTIME,
  EDIT_LOGBOOK_OVERTIME,
  GET_ACCOUNTS_GROUPS,
  CREATE_ACCOUNTS_GROUP,
  CREATE_ACCOUNTS_SUBGROUP,
  DELETE_ACCOUNTS_GROUP,
  DELETE_ACCOUNTS_SUBGROUP,
  PATCH_ACCOUNTS_GROUP,
  PATCH_ACCOUNTS_SUBGROUP,
  GET_EMPLOYEES_ALL,
  GET_EMPLOYEES_EDIT,
  UPDATE_EMPLOYEE,
  GET_CURRENCY,
  DELETE_EMPLOYEE, EMPLOYEE_ACTIONS,
} from './types';
import {
  getSettingCompanySuccess,
  addSnackbar,
  dismissSnackbar,
  getSettingWorkTimeSuccess,
  addHolidaySuccess,
  deleteHolidaySuccess,
  getSecurityCompanySuccess,
  editSecurityPageSuccess,
  loadSkillsSuccess,
  createSkillSuccess,
  loadPlaceSuccess,
  loadActivityLogSuccess,
  loadEmployeesSuccess,
  loadDeleteDataSuccess,
  loadLogbookJournalSuccess,
  editLogbookJournalSuccess,
  loadLogbookOvertimeSuccess,
  editLogbookOvertimeSuccess,
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
  loadEmployeesError,
  loadEmployeesEditSuccess,
  loadEmployeesEditError,
  patchEmployeeError,
  loadEmployeesAll,
  getCurrenciesSuccess,
  removeEmployeeError,
  removeEmployeeSuccess, setEmployeesActionsError,
} from './actions';

function token() {
  const token = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
    yield put(getSettingWorkTimeSuccess(data));
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
    const { data } = yield call(axios.delete, `${config.api.url}/company/${action.companyId}/work-time/holidays/delete/${action.id}`, token());
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
    yield put(loadEmployeesError());
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
    const { data } = yield call(axios.patch, `${config.api.url}/company/${action.id}/logbook/journal/store`, action.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(editLogbookJournalSuccess(data));
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
    const { data } = yield call(axios.patch,
      `${config.api.url}/company/${action.id}/logbook/overtime/store`, action.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    yield put(editLogbookOvertimeSuccess(data));
    yield put(addSnackbar('Edit Overtime successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(addSnackbar('An error occurred while creating the Overtime', 'error'));
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
        id: company_id,
        parent_group_id,
        name,
      },
    } = action;
    const { data } = yield call(
      axios.post, `${config.api.url}/company/${action.id}/groups/create`, {
        company_id,
        parent_group_id,
        name,
      }, token(),
    );

    const Groups = yield select((state) => state.settings.groups);

    const groups = Groups.map((grp) => {
      if (grp.id === parent_group_id) {
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
          const subgroups = group.subgroups.filter((sbgrp) => sbgrp.id !== action.groupId);
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
      `${config.api.url}/company/${action.id}/groups/update/${action.groupId}`,
      { subgroup, ...rest }, token());
    const Groups = yield select((state) => state.settings.groups);
    let groups = [];

    if (subgroup) {
      groups = Groups.map((group) => {
        const subgroups = group.subgroups?.map((sbgrp) => {
          if (sbgrp.id === action.groupId) {
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
        if (group.id === action.groupId) {
          return { ...data };
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

function* getEmployeeEdit(action) {
  try {
    const { data } = yield call(axios.get, `${config.api.url}/company/${action.id}/employees/edit/${action.employeeId}`, token());
    yield put(loadEmployeesEditSuccess(data));
  } catch (e) {
    console.log(e);
    yield put(loadEmployeesEditError());
  }
}

function* updateEmployee(action) {
  try {
    const {
      group,
      subgroup,
      place,
      ...rest
    } = action.data;
    // eslint-disable-next-line no-unused-vars
    const { data } = yield call(axios.patch,
      `${config.api.url}/company/${action.id}/employees/update/${action.employeeId}`,
      { ...rest }, token());
    if (place) {
      // eslint-disable-next-line no-unused-vars,no-shadow
      const { data } = yield call(axios.post,
        `${config.api.url}/company/${action.id}/employees/assign-place`, {
          employee_id: action.employeeId,
          place_id: parseInt(place, 10),
        }, token());
    }
    if (group) {
      const payload = {
        group_id: parseInt(group, 10),
        employee_id: action.employeeId,
      };
      // eslint-disable-next-line no-unused-vars,no-shadow
      const { data } = yield call(axios.post,
        `${config.api.url}/company/${action.id}/employees/assign-group`, payload, token());
    }
    if (subgroup) {
      // eslint-disable-next-line no-unused-vars,no-shadow
      const { data } = yield call(axios.post,
        `${config.api.url}/company/${action.id}/employees/assign-group`, {
          employee_id: action.employeeId,
          parent_group_id: parseInt(group, 10),
          group_id: parseInt(subgroup, 10),
          subgroup: true,
        }, token());
    }

    yield put(loadEmployeesAll(action.id));

    yield put(addSnackbar('Updated account successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(patchEmployeeError(e));
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
    yield put(addSnackbar('Changed status successfully', 'success'));
    yield delay(4000);
    yield put(dismissSnackbar());
  } catch (e) {
    yield put(setEmployeesActionsError(e));
    yield put(addSnackbar('An error occurred while changing employee\'s status', 'error'));
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
  yield takeLatest(GET_EMPLOYEES_ALL, loadEmployee);
  yield takeLatest(FILTER_ACTIVITY_LOG, filterActivityLog);
  yield takeLatest(GET_DELETE_DATA, loadDeleteData);
  yield takeLatest(DELETE_DATA, deleteCompanyData);
  yield takeLatest(GET_LOGBOOK_JOURNAL, loadJournalData);
  yield takeLatest(EDIT_LOGBOOK_JOURNAL, patchLogbookJournal);
  yield takeLatest(GET_LOGBOOK_OVERTIME, loadOvertimeData);
  yield takeLatest(EDIT_LOGBOOK_OVERTIME, patchLogbookOvertime);
  yield takeLatest(GET_ACCOUNTS_GROUPS, loadAccountGroups);
  yield takeLatest(CREATE_ACCOUNTS_GROUP, createAccountGroup);
  yield takeLatest(CREATE_ACCOUNTS_SUBGROUP, createAccountSubgroup);
  yield takeLatest(DELETE_ACCOUNTS_GROUP, deleteAccountGroup);
  yield takeLatest(DELETE_ACCOUNTS_SUBGROUP, deleteAccountGroup);
  yield takeLatest(PATCH_ACCOUNTS_GROUP, patchAccountGroup);
  yield takeLatest(PATCH_ACCOUNTS_SUBGROUP, patchAccountGroup);
  yield takeLatest(GET_EMPLOYEES_EDIT, getEmployeeEdit);
  yield takeLatest(UPDATE_EMPLOYEE, updateEmployee);
  yield takeLatest(GET_CURRENCY, loadCurrencies);
  yield takeLatest(DELETE_EMPLOYEE, deleteEmployee);
  yield takeLatest(EMPLOYEE_ACTIONS, setEmployeesActions);
}
