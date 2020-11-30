import {
  GET_SETTINGS_COMPANY, GET_SETTINGS_COMPANY_SUCCESS,
  PATCH_SETTINGS_COMPANY, PATCH_SETTINGS_COMPANY_SUCCESS,
  ADD_SETTING_SNACKBAR, DISMISS_SETTING_SNACKBAR,
  GET_WORK_TIME, GET_WORK_TIME_SUCCESS,
  PATCH_WORK_TIME,
  ADD_HOLIDAY, ADD_HOLIDAY_SUCCESS,
  DELETE_HOLIDAY, DELETE_HOLIDAY_SUCCESS,
  GET_SECURITY_COMPANY, GET_SECURITY_COMPANY_SUCCESS,
  PATCH_SECURITY_COMPANY, PATCH_SECURITY_COMPANY_SUCCESS,
  GET_SKILLS, GET_SKILLS_SUCCESS,
  CREATE_SKILL, CREATE_SKILL_SUCCESS,
  CREATE_JOB, CREATE_PLACE, GET_PLACE, GET_PLACE_SUCCESS,
  GET_ACTIVITY_LOG, GET_ACTIVITY_LOG_SUCCESS,
  GET_EMPLOYEES, GET_EMPLOYEES_SUCCESS, FILTER_ACTIVITY_LOG
} from './types';

export const getSettingCompany = (id) => ({
  type: GET_SETTINGS_COMPANY,
  id
});
export const getSettingCompanySuccess = (data) => ({
  type: GET_SETTINGS_COMPANY_SUCCESS,
  data
});

export const editSettingCompany = (data, id) => ({
  type: PATCH_SETTINGS_COMPANY,
  data,
  id
});
export const editSettingCompanySuccess = (data) => ({
  type: PATCH_SETTINGS_COMPANY_SUCCESS,
  data
});

export const addSnackbar = (data, snackbarType) => ({
  type: ADD_SETTING_SNACKBAR,
  data,
  snackbarType,
});
export const dismissSnackbar = () => ({ type: DISMISS_SETTING_SNACKBAR });

export const getSettingWorkTime = (id) => ({
  type: GET_WORK_TIME,
  id
});
export const getSettingWorkTimeSuccess = (data) => ({
  type: GET_WORK_TIME_SUCCESS,
  data
});

export const patchWorkTime = (data, id) => ({
  type: PATCH_WORK_TIME,
  data,
  id
});

export const addHoliday = (data, id) => ({
  type: ADD_HOLIDAY,
  data,
  id
});
export const addHolidaySuccess = (data) => ({
  type: ADD_HOLIDAY_SUCCESS,
  data
});

export const deleteHoliday = (id, companyId) => ({
  type: DELETE_HOLIDAY,
  id,
  companyId
});
export const deleteHolidaySuccess = (id) => ({
  type: DELETE_HOLIDAY_SUCCESS,
  id,
});

export const getSecurityCompany = (id) => ({
  type: GET_SECURITY_COMPANY,
  id
});
export const getSecurityCompanySuccess = (data) => ({
  type: GET_SECURITY_COMPANY_SUCCESS,
  data
});

export const editSecurityPage = (data, id) => ({
  type: PATCH_SECURITY_COMPANY,
  data,
  id,
});
export const editSecurityPageSuccess = (data) => ({
  type: PATCH_SECURITY_COMPANY_SUCCESS,
  data
});

export const loadSkills = (id) => ({
  type: GET_SKILLS,
  id
});
export const loadSkillsSuccess = (data) => ({
  type: GET_SKILLS_SUCCESS,
  data
});

export const createSkill = (data, id) => ({
  type: CREATE_SKILL,
  data,
  id,
});
export const createSkillSuccess = (data) => ({
  type: CREATE_SKILL_SUCCESS,
  data
});

export const actionCreateJob = (data, id) => ({
  type: CREATE_JOB,
  data,
  id
})

export const actuionCreatePlace = (data, id) => ({
  type: CREATE_PLACE,
  data,
  id
})

export const loadPlace = (id) => ({
  type: GET_PLACE,
  id
})
export const loadPlaceSuccess = (data) => ({
  type: GET_PLACE_SUCCESS,
  data
})

export const loadEmployees = (id) => ({
  type: GET_EMPLOYEES,
  id
})
export const loadEmployeesSuccess = (data) => ({
  type: GET_EMPLOYEES_SUCCESS,
  data
})

export const loadActivityLog = (id) => ({
  type: GET_ACTIVITY_LOG,
  id,
})
export const loadActivityLogSuccess = (data) => ({
  type: GET_ACTIVITY_LOG_SUCCESS,
  data
})

export const filterActivityLog = (id, data) => ({
  type: FILTER_ACTIVITY_LOG,
  id,
  data
})