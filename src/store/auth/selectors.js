export const isAuthorizedSelector = (state) => state.auth.isAuthorized;
export const userSelector = (state) => state.auth.user;
export const authErrorSelector = (state) => state.auth.error;
export const isAuthLoading = (state) => state.auth.loading;
