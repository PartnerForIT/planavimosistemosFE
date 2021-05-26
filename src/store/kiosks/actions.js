import {
  GET_KIOSKS,
  GET_KIOSKS_SUCCESS,
  GET_KIOSKS_ERROR,
  POST_KIOSK,
  POST_KIOSK_SUCCESS,
  POST_KIOSK_ERROR,
  PATCH_KIOSK,
  PATCH_KIOSK_SUCCESS,
  PATCH_KIOSK_ERROR,
  POST_KIOSK_CHANGE_PASSWORD,
  POST_KIOSK_CHANGE_PASSWORD_SUCCESS,
  POST_KIOSK_CHANGE_PASSWORD_ERROR,
  DELETE_KIOSK,
  DELETE_KIOSK_SUCCESS,
  DELETE_KIOSK_ERROR,
  GET_SETTINGS_PHOTO_TAKE,
  GET_SETTINGS_PHOTO_TAKE_SUCCESS,
  GET_SETTINGS_PHOTO_TAKE_ERROR,
  POST_SETTINGS_PHOTO_TAKE,
  POST_SETTINGS_PHOTO_TAKE_SUCCESS,
  POST_SETTINGS_PHOTO_TAKE_ERROR,

  GET_KIOSKS_USERS,
  GET_KIOSKS_USERS_SUCCESS,
  GET_KIOSKS_USERS_ERROR,
  PATCH_UPDATE_STATUS,
  PATCH_UPDATE_STATUS_SUCCESS,
  PATCH_UPDATE_STATUS_ERROR,
  PATCH_UPDATE_PIN_CODE,
  PATCH_UPDATE_PIN_CODE_SUCCESS,
  PATCH_UPDATE_PIN_CODE_ERROR,
  PATCH_UPDATE_PIN_CODES,
  PATCH_UPDATE_PIN_CODES_SUCCESS,
  PATCH_UPDATE_PIN_CODES_ERROR,
  GET_PIN_CODE_GENERATE,
  GET_PIN_CODE_GENERATE_SUCCESS,
  GET_PIN_CODE_GENERATE_ERROR,
} from './types';

export const getKiosks = (companyId, placeId) => ({
  type: GET_KIOSKS,
  companyId,
  placeId,
});
export const getKiosksSuccess = (data) => ({
  type: GET_KIOSKS_SUCCESS,
  data,
});
export const getKiosksError = (data) => ({
  type: GET_KIOSKS_ERROR,
  data,
});

export const postKiosk = (companyId, data) => ({
  type: POST_KIOSK,
  companyId,
  data,
});
export const postKioskSuccess = (data) => ({
  type: POST_KIOSK_SUCCESS,
  data,
});
export const postKioskError = () => ({
  type: POST_KIOSK_ERROR,
});

export const patchKiosk = (companyId, id, data) => ({
  type: PATCH_KIOSK,
  companyId,
  id,
  data,
});
export const patchKioskSuccess = (data) => ({
  type: PATCH_KIOSK_SUCCESS,
  data,
});
export const patchKioskError = () => ({
  type: PATCH_KIOSK_ERROR,
});

export const postKioskChangePassword = (companyId, id, data) => ({
  type: POST_KIOSK_CHANGE_PASSWORD,
  companyId,
  id,
  data,
});
export const postKioskChangePasswordSuccess = (id, data) => ({
  type: POST_KIOSK_CHANGE_PASSWORD_SUCCESS,
  id,
  data,
});
export const postKioskChangePasswordError = () => ({
  type: POST_KIOSK_CHANGE_PASSWORD_ERROR,
});

export const deleteKiosk = (companyId, id) => ({
  type: DELETE_KIOSK,
  companyId,
  id,
});
export const deleteKioskSuccess = (id) => ({
  type: DELETE_KIOSK_SUCCESS,
  id,
});
export const deleteKioskError = () => ({
  type: DELETE_KIOSK_ERROR,
});

export const getSettingsPhotoTake = (companyId) => ({
  type: GET_SETTINGS_PHOTO_TAKE,
  companyId,
});
export const getSettingsPhotoTakeSuccess = (data) => ({
  type: GET_SETTINGS_PHOTO_TAKE_SUCCESS,
  data,
});
export const getSettingsPhotoTakeError = () => ({
  type: GET_SETTINGS_PHOTO_TAKE_ERROR,
});

export const postSettingsPhotoTake = (companyId, name, value) => ({
  type: POST_SETTINGS_PHOTO_TAKE,
  companyId,
  name,
  value,
});
export const postSettingsPhotoTakeSuccess = () => ({
  type: POST_SETTINGS_PHOTO_TAKE_SUCCESS,
});
export const postSettingsPhotoTakeError = () => ({
  type: POST_SETTINGS_PHOTO_TAKE_ERROR,
});

export const getKiosksUsers = (companyId, isKiosk) => ({
  type: GET_KIOSKS_USERS,
  companyId,
  isKiosk,
});
export const getKiosksUsersSuccess = (data) => ({
  type: GET_KIOSKS_USERS_SUCCESS,
  data,
});
export const getKiosksUsersError = (data) => ({
  type: GET_KIOSKS_USERS_ERROR,
  data,
});

export const patchUpdateStatus = (companyId, data) => ({
  type: PATCH_UPDATE_STATUS,
  companyId,
  data,
});
export const patchUpdateStatusSuccess = (data) => ({
  type: PATCH_UPDATE_STATUS_SUCCESS,
  data,
});
export const patchUpdateStatusError = (data) => ({
  type: PATCH_UPDATE_STATUS_ERROR,
  data,
});

export const patchUpdatePinCode = (companyId, employeeId, data) => ({
  type: PATCH_UPDATE_PIN_CODE,
  companyId,
  employeeId,
  data,
});
export const patchUpdatePinCodeSuccess = (employeeId, data) => ({
  type: PATCH_UPDATE_PIN_CODE_SUCCESS,
  employeeId,
  data,
});
export const patchUpdatePinCodeError = (data) => ({
  type: PATCH_UPDATE_PIN_CODE_ERROR,
  data,
});

export const patchUpdatePinCodes = (companyId, data) => ({
  type: PATCH_UPDATE_PIN_CODES,
  companyId,
  data,
});
export const patchUpdatePinCodesSuccess = (data) => ({
  type: PATCH_UPDATE_PIN_CODES_SUCCESS,
  data,
});
export const patchUpdatePinCodesError = () => ({
  type: PATCH_UPDATE_PIN_CODES_ERROR,
});

export const getPinCodeGenerate = (companyId) => ({
  type: GET_PIN_CODE_GENERATE,
  companyId,
});
export const getPinCodeGenerateSuccess = (data) => ({
  type: GET_PIN_CODE_GENERATE_SUCCESS,
  data,
});
export const getPinCodeGenerateError = () => ({
  type: GET_PIN_CODE_GENERATE_ERROR,
});
