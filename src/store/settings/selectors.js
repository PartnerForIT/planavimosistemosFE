import { createSelector } from 'reselect';

export const settingCompanySelector = (state) => state.settings.company;
export const isLoadingSelector = (state) => state.settings.loading;
export const settingsLoadingSelector = (state) => state.settings.settingsLoading;
export const isShowSnackbar = (state) => state.settings.snackbarShow;
export const snackbarType = (state) => state.settings.snackbarType;
export const snackbarText = (state) => state.settings.snackbarText;
export const settingWorkTime = (state) => state.settings.workTime;
export const securityCompanySelector = (state) => state.settings.security;
export const categoriesSkillsSelector = (state) => state.settings.skills;
export const placesSelector = (state) => state.settings.places;

export const employees = (state) => state.settings.employees;
export const employeesSelector = createSelector(employees, (e) => e);

export const employeeSelector = (state) => state.settings.employee;
export const employeesLoadingSelector = (state) => state.settings.employeesLoading;
export const activityLogSelector = (state) => state.settings.activity_log;
export const deleteDataSelector = (state) => state.settings.deleteData;
export const JournalDataSelector = (state) => state.settings.journal;
export const OvertimeDataSelector = (state) => state.settings.overtime;
export const AccountGroupsSelector = (state) => state.settings.groups;
export const groupsLoadingSelector = (state) => state.settings.groupLoading;
export const subGroupsLoadingSelector = (state) => state.settings.subgroupLoading;
export const currencySelector = (state) => state.settings.currency;
export const rolesSelector = (state) => state.settings.roles;
export const rolesLoading = (state) => state.settings.rolesLoading;
export const permissionsSelector = (state) => state.settings.permissions;
