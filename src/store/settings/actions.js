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
  GET_ACCOUNTS_GROUPS,
  GET_ACCOUNTS_GROUPS_SUCCESS,
  CREATE_ACCOUNTS_GROUP,
  CREATE_ACCOUNTS_GROUP_SUCCESS,
  CREATE_ACCOUNTS_SUBGROUP,
  CREATE_ACCOUNTS_SUBGROUP_SUCCESS,
  CREATE_ACCOUNTS_GROUP_ERROR,
  PATCH_ACCOUNTS_SUBGROUP,
  DELETE_ACCOUNTS_SUBGROUP,
  PATCH_ACCOUNTS_SUBGROUP_SUCCESS,
  DELETE_ACCOUNTS_SUBGROUP_SUCCESS,
  DELETE_ACCOUNTS_GROUP,
  DELETE_ACCOUNTS_GROUP_SUCCESS,
  DELETE_ACCOUNTS_GROUP_ERROR,
  DELETE_ACCOUNTS_SUBGROUP_ERROR,
  PATCH_ACCOUNTS_GROUP,
  PATCH_ACCOUNTS_GROUP_SUCCESS,
  PATCH_ACCOUNTS_GROUP_ERROR,
  PATCH_ACCOUNTS_SUBGROUP_ERROR,
  GET_ROLES,
  GET_ROLES_SUCCESS,
  GET_ROLES_ERROR,
  CREATE_ROLE,
  CREATE_ROLE_SUCCESS,
  CREATE_ROLE_ERROR,
  DELETE_ROLE,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_ERROR, UPDATE_ROLE, UPDATE_ROLE_SUCCESS, UPDATE_ROLE_ERROR,
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

export const createAccountGroupError = (data) => ({
  type: CREATE_ACCOUNTS_GROUP_ERROR,
  data,
});

export const removeAccountGroup = (id, groupId) => ({
  type: DELETE_ACCOUNTS_GROUP,
  id,
  groupId,
});

export const removeAccountGroupSuccess = (data) => ({
  type: DELETE_ACCOUNTS_GROUP_SUCCESS,
  data,
});

export const removeAccountGroupError = (data) => ({
  type: DELETE_ACCOUNTS_GROUP_ERROR,
  data,
});

export const editAccountGroup = (id, data) => ({
  type: PATCH_ACCOUNTS_GROUP,
  id,
  ...data,
});

export const editAccountGroupSuccess = (data) => ({
  type: PATCH_ACCOUNTS_GROUP_SUCCESS,
  data,
});

export const editAccountGroupError = () => ({
  type: PATCH_ACCOUNTS_GROUP_ERROR,
});

export const createAccountSubgroup = (id, data) => ({
  type: CREATE_ACCOUNTS_SUBGROUP,
  data,
  id,
// parent_group_id
});

export const createAccountSubgroupSuccess = (data) => ({
  type: CREATE_ACCOUNTS_SUBGROUP_SUCCESS,
  data,
});
export const createAccountSubgroupError = (data) => ({
  type: CREATE_ACCOUNTS_SUBGROUP_SUCCESS,
  data,
});

export const editAccountSubgroup = (id, data) => ({
  type: PATCH_ACCOUNTS_SUBGROUP,
  id,
  subgroup: true,
  name: data.name,
  groupId: data.parentGroupId,
});

export const editAccountSubgroupSuccess = () => ({
  type: PATCH_ACCOUNTS_SUBGROUP_SUCCESS,
});

export const editAccountSubgroupError = () => ({
  type: PATCH_ACCOUNTS_SUBGROUP_ERROR,
});

export const removeAccountSubgroup = (id, groupId) => ({
  type: DELETE_ACCOUNTS_SUBGROUP,
  id,
  groupId,
  subgroup: true,
});

export const removeAccountSubgroupSuccess = () => ({
  type: DELETE_ACCOUNTS_SUBGROUP_SUCCESS,
});

export const removeAccountSubgroupError = () => ({
  type: DELETE_ACCOUNTS_SUBGROUP_ERROR,
});

export const getRoles = (companyId) => ({
  type: GET_ROLES,
  companyId,
});

export const getRolesSuccess = (data) => ({
  type: GET_ROLES_SUCCESS,
  data,
});

export const getRolesError = (data) => ({
  type: GET_ROLES_ERROR,
  data,
});

export const createRole = (companyId, name) => ({
  type: CREATE_ROLE,
  companyId,
  name,
});

export const createRoleSuccess = (data) => ({
  type: CREATE_ROLE_SUCCESS,
  data,
});

export const createRoleError = (data) => ({
  type: CREATE_ROLE_ERROR,
  data,
});

export const deleteRole = (companyId, roleId) => ({
  type: DELETE_ROLE,
  companyId,
  roleId,
});

export const deleteRoleSuccess = (data) => ({
  type: DELETE_ROLE_SUCCESS,
  data,
});

export const deleteRoleError = (data) => ({
  type: DELETE_ROLE_ERROR,
  data,
});

export const updateRole = (companyId, roleId, data) => ({
  type: UPDATE_ROLE,
  companyId,
  roleId,
  data,
});

export const updateRoleSuccess = (data) => ({
  type: UPDATE_ROLE_SUCCESS,
  data,
});

export const updateRoleError = (data) => ({
  type: UPDATE_ROLE_ERROR,
  data,
});
