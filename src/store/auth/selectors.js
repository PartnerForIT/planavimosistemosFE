export const isAuthorizedSelector = (state) => state.auth.isAuthorized;
export const userSelector = (state) => state.auth.user;
export const companyIdSelector = (state) => state.auth.user.employee.company_id;
export const authErrorSelector = (state) => state.auth.error;
export const isLoadingSelector = (state) => state.auth.loading;
