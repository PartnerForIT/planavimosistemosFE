import {
  GET_SETTINGS_COMPANY,
  GET_SETTINGS_COMPANY_SUCCESS,
  PATCH_SETTINGS_COMPANY,
  PATCH_SETTINGS_COMPANY_SUCCESS,
  ADD_SETTING_SNACKBAR,
  DISMISS_SETTING_SNACKBAR,
  GET_WORK_TIME,
  GET_WORK_TIME_SUCCESS,
  PATCH_WORK_TIME,
  ADD_HOLIDAY,
  ADD_HOLIDAY_SUCCESS,
  DELETE_HOLIDAY,
  DELETE_HOLIDAY_SUCCESS,
  GET_SECURITY_COMPANY,
  GET_SECURITY_COMPANY_SUCCESS,
  PATCH_SECURITY_COMPANY,
  PATCH_SECURITY_COMPANY_SUCCESS,
  GET_SKILLS,
  GET_SKILLS_SUCCESS,
  CREATE_SKILL,
  CREATE_SKILL_SUCCESS,
  CREATE_JOB,
  CREATE_PLACE,
  GET_PLACE,
  GET_PLACE_SUCCESS,
  GET_ACTIVITY_LOG,
  GET_ACTIVITY_LOG_SUCCESS,
  GET_EMPLOYEES,
  GET_EMPLOYEES_SUCCESS,
  FILTER_ACTIVITY_LOG,
  GET_DELETE_DATA,
  GET_DELETE_DATA_SUCCESS,
  DELETE_DATA,
  GET_LOGBOOK_JOURNAL,
  GET_LOGBOOK_JOURNAL_SUCCESS,
  EDIT_LOGBOOK_JOURNAL,
  EDIT_LOGBOOK_JOURNAL_SUCCESS,
  GET_LOGBOOK_OVERTIME,
  GET_LOGBOOK_OVERTIME_SUCCESS,
  EDIT_LOGBOOK_OVERTIME,
  EDIT_LOGBOOK_OVERTIME_SUCCESS,
  GET_ACCOUNTS_GROUPS, GET_ACCOUNTS_GROUPS_SUCCESS, CREATE_ACCOUNTS_GROUP, CREATE_ACCOUNTS_GROUP_SUCCESS,
} from './types';

export const getSettingCompany = (id) => ({
  type: GET_SETTINGS_COMPANY,
  id,
});
export const getSettingCompanySuccess = (data) => ({
  type: GET_SETTINGS_COMPANY_SUCCESS,
  data,
});

export const editSettingCompany = (data, id) => ({
  type: PATCH_SETTINGS_COMPANY,
  data,
  id,
});
export const editSettingCompanySuccess = (data) => ({
  type: PATCH_SETTINGS_COMPANY_SUCCESS,
  data,
});

export const addSnackbar = (data, snackbarType) => ({
  type: ADD_SETTING_SNACKBAR,
  data,
  snackbarType,
});
export const dismissSnackbar = () => ({ type: DISMISS_SETTING_SNACKBAR });

export const getSettingWorkTime = (id) => ({
  type: GET_WORK_TIME,
  id,
});
export const getSettingWorkTimeSuccess = (data) => ({
  type: GET_WORK_TIME_SUCCESS,
  data,
});

export const patchWorkTime = (data, id) => ({
  type: PATCH_WORK_TIME,
  data,
  id,
});

export const addHoliday = (data, id) => ({
  type: ADD_HOLIDAY,
  data,
  id,
});
export const addHolidaySuccess = (data) => ({
  type: ADD_HOLIDAY_SUCCESS,
  data,
});

export const deleteHoliday = (id, companyId) => ({
  type: DELETE_HOLIDAY,
  id,
  companyId,
});
export const deleteHolidaySuccess = (id) => ({
  type: DELETE_HOLIDAY_SUCCESS,
  id,
});

export const getSecurityCompany = (id) => ({
  type: GET_SECURITY_COMPANY,
  id,
});
export const getSecurityCompanySuccess = (data) => ({
  type: GET_SECURITY_COMPANY_SUCCESS,
  data,
});

export const editSecurityPage = (data, id) => ({
  type: PATCH_SECURITY_COMPANY,
  data,
  id,
});
export const editSecurityPageSuccess = (data) => ({
  type: PATCH_SECURITY_COMPANY_SUCCESS,
  data,
});

export const loadSkills = (id) => ({
  type: GET_SKILLS,
  id,
});
export const loadSkillsSuccess = (data) => ({
  type: GET_SKILLS_SUCCESS,
  data,
});

export const createSkill = (data, id) => ({
  type: CREATE_SKILL,
  data,
  id,
});
export const createSkillSuccess = (data) => ({
  type: CREATE_SKILL_SUCCESS,
  data,
});

export const actionCreateJob = (data, id) => ({
  type: CREATE_JOB,
  data,
  id,
});

export const actuionCreatePlace = (data, id) => ({
  type: CREATE_PLACE,
  data,
  id,
});

export const loadPlace = (id) => ({
  type: GET_PLACE,
  id,
});
export const loadPlaceSuccess = (data) => ({
  type: GET_PLACE_SUCCESS,
  data,
});

export const loadEmployees = (id) => ({
  type: GET_EMPLOYEES,
  id,
});
export const loadEmployeesSuccess = (data) => ({
  type: GET_EMPLOYEES_SUCCESS,
  data,
});

export const loadActivityLog = (id) => ({
  type: GET_ACTIVITY_LOG,
  id,
});
export const loadActivityLogSuccess = (data) => ({
  type: GET_ACTIVITY_LOG_SUCCESS,
  data,
});

export const filterActivityLog = (id, data) => ({
  type: FILTER_ACTIVITY_LOG,
  id,
  data,
});

export const loadDeleteData = (id) => ({
  type: GET_DELETE_DATA,
  id,
});
export const loadDeleteDataSuccess = (data) => ({
  type: GET_DELETE_DATA_SUCCESS,
  data,
});

export const deleteDataCompany = (id, data) => ({
  type: DELETE_DATA,
  id,
  data,
});

export const loadLogbookJournal = (id) => ({
  type: GET_LOGBOOK_JOURNAL,
  id,
});
export const loadLogbookJournalSuccess = (data) => ({
  type: GET_LOGBOOK_JOURNAL_SUCCESS,
  data,
});

export const editLogbookJournal = (id, data) => ({
  type: EDIT_LOGBOOK_JOURNAL,
  id,
  data,
});
export const editLogbookJournalSuccess = (data) => ({
  type: EDIT_LOGBOOK_JOURNAL_SUCCESS,
  data,
});

export const loadLogbookOvertime = (id) => ({
  type: GET_LOGBOOK_OVERTIME,
  id,
});
export const loadLogbookOvertimeSuccess = (data) => ({
  type: GET_LOGBOOK_OVERTIME_SUCCESS,
  data,
});
export const editLogbookOvertime = (id, data) => ({
  type: EDIT_LOGBOOK_OVERTIME,
  id,
  data,
});
export const editLogbookOvertimeSuccess = (data) => ({
  type: EDIT_LOGBOOK_OVERTIME_SUCCESS,
  data,
});

export const getAccountGroups = (id) => ({
  type: GET_ACCOUNTS_GROUPS,
  id,
});

export const getAccountGroupsSuccess = (data) => ({
  type: GET_ACCOUNTS_GROUPS_SUCCESS,
  data,
});

export const createAccountGroup = (id, data) => ({
  type: CREATE_ACCOUNTS_GROUP,
  data,
  id,
});

export const createAccountGroupSuccess = (data) => ({
  type: CREATE_ACCOUNTS_GROUP_SUCCESS,
  data,
});
