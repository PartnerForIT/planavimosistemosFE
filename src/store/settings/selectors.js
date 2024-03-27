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
export const shiftsSelector = (state) => state.settings.shifts;
export const jobTypesSelector = (state) => state.settings.job_types;

export const employees = (state) => state.settings.employees;
export const employeesSelector = createSelector(employees, (e) => e);
export const importedEmployees = (state) => state.settings.import;
export const importLoadingSelector = (state) => state.settings.importLoading;

export const employeeSelector = (state) => state.settings.employee;
export const employeeLoadingSelector = (state) => state.settings.employeeLoading;
export const employeesLoadingSelector = (state) => state.settings.employeesLoading;
export const activityLogSelector = (state) => state.settings.activity_log;
export const deleteDataSelector = (state) => state.settings.deleteData;
export const JournalDataSelector = (state) => state.settings.journal;
export const TimeSheetDataSelector = (state) => state.settings.timeSheet;
export const IntegrationsDataSelector = (state) => state.settings.integrations;
export const OvertimeDataSelector = (state) => state.settings.overtime;
export const AdditionalRatesDataSelector = (state) => state.settings.additionalRates;
export const ClockDataSelector = (state) => state.settings.clock;
export const AccountGroupsSelector = (state) => state.settings.groups;
export const groupsLoadingSelector = (state) => state.settings.groupLoading;
export const subGroupsLoadingSelector = (state) => state.settings.subgroupLoading;
export const currencySelector = (state) => state.settings.currency;
export const rolesSelector = (state) => state.settings.roles;
export const rolesLoading = (state) => state.settings.rolesLoading;
export const permissionsSelector = (state) => state.settings.permissions;

export const eventsSelector = (state) => state.settings.events;
export const eventsTypesSelector = (state) => state.settings.eventsTypes;
export const eventsLoadingSelector = (state) => state.settings.eventsLoading;
export const eventUpdateLoadingSelector = (state) => state.settings.eventUpdateLoading;

export const errorPushEmployerSelector = (state) => state.settings.errorCreatingEmployer;

// schedule
export const scheduleSelector = (state) => state.settings.schedule;
export const scheduleLoadingSelector = (state) => state.settings.scheduleLoading;
