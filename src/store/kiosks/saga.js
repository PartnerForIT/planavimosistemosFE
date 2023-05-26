import {
  call,
  put,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import config from 'config';
import axios from 'axios';

import {
  GET_KIOSKS,
  POST_KIOSK,
  DELETE_KIOSK,
  PATCH_KIOSK,
  POST_KIOSK_CHANGE_PASSWORD,
  GET_SETTINGS_PHOTO_TAKE,
  POST_SETTINGS_PHOTO_TAKE,
  GET_KIOSKS_USERS,
  PATCH_UPDATE_STATUS,
  PATCH_UPDATE_PIN_CODE,
  PATCH_UPDATE_PIN_CODES,
  GET_PIN_CODE_GENERATE,
} from './types';
import {
  addSnackbar,
  dismissSnackbar,
} from '../settings/actions';
import {
  getKiosksSuccess,
  getKiosksError,
  postKioskSuccess,
  postKioskError,
  patchKioskSuccess,
  patchKioskError,
  postKioskChangePasswordSuccess,
  postKioskChangePasswordError,
  deleteKioskSuccess,
  deleteKioskError,
  getSettingsPhotoTakeSuccess,
  getSettingsPhotoTakeError,
  postSettingsPhotoTakeSuccess,
  postSettingsPhotoTakeError,
  getKiosksUsersSuccess,
  getKiosksUsersError,
  patchUpdateStatusSuccess,
  patchUpdateStatusError,
  patchUpdatePinCodeSuccess,
  patchUpdatePinCodeError,
  patchUpdatePinCodesSuccess,
  patchUpdatePinCodesError,
  getPinCodeGenerateSuccess,
  getPinCodeGenerateError,
} from './actions';
import getToken from '../getToken';

function* getKiosks(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/kiosk${action.placeId ? `?place_ids=[${action.placeId}]` : ''}`,
      getToken(),
    );
    yield put(getKiosksSuccess(data));
  } catch (e) {
    yield put(getKiosksError());
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* postKiosk(action) {
  try {
    const { data } = yield call(
      axios.post,
      `${config.api.url}/company/${action.companyId}/kiosk/store`,
      action.data,
      getToken(),
    );

    if (data.message) {
      throw new Error(data.message);
    }

    yield put(postKioskSuccess(data));
  } catch (e) {
    yield put(postKioskError());
    yield put(addSnackbar(e.response?.data?.message || e.message || 'An error occurred while adding a kiosk', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchKiosk(action) {
  try {
    const { data } = yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/kiosk/update/${action.id}`,
      action.data,
      getToken(),
    );
    yield put(patchKioskSuccess(data));
  } catch (e) {
    yield put(patchKioskError());
    yield put(addSnackbar('An error occurred while updating a kiosk', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* postKioskChangePassword(action) {
  try {
    yield call(
      axios.post,
      `${config.api.url}/company/${action.companyId}/kiosk/${action.id}/change-password`,
      action.data,
      getToken(),
    );
    yield put(postKioskChangePasswordSuccess(action.id, action.data));
  } catch (e) {
    yield put(postKioskChangePasswordError());
    yield put(addSnackbar('An error occurred while updating a kiosk', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* deleteKiosk(action) {
  try {
    yield call(
      axios.delete,
      `${config.api.url}/company/${action.companyId}/kiosk/delete/${action.id}`,
      getToken(),
    );
    yield put(deleteKioskSuccess(action.id));
  } catch (e) {
    yield put(deleteKioskError());
    yield put(addSnackbar('An error occurred while deleting a kiosk', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* getSettingsPhotoTake(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/kiosk/setting-photo-take`,
      getToken(),
    );
    yield put(getSettingsPhotoTakeSuccess(data));
  } catch (e) {
    yield put(getSettingsPhotoTakeError());
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* postSettingsPhotoTake(action) {
  try {
    yield call(
      axios.post,
      `${config.api.url}/company/${action.companyId}/kiosk/setting-photo-take/${action.name}/${action.value}`,
      {},
      getToken(),
    );
    yield put(postSettingsPhotoTakeSuccess());
  } catch (e) {
    yield put(postSettingsPhotoTakeError());
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* getKiosksUsers(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/kiosk/users`,
      {
        ...getToken(),
        params: {
          is_kiosk: action.isKiosk,
        },
      },
    );
    yield put(getKiosksUsersSuccess(data));
  } catch (e) {
    yield put(getKiosksUsersError());
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchUpdateStatus(action) {
  try {
    yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/kiosk/users/update-status`,
      action.data,
      getToken(),
    );
    yield put(patchUpdateStatusSuccess(action.data));
  } catch (e) {
    yield put(patchUpdateStatusError());
    yield put(addSnackbar(e, 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchUpdatePinCode(action) {
  try {
    yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/kiosk/user/${action.employeeId}/update-pin-code`,
      action.data,
      getToken(),
    );
    yield put(patchUpdatePinCodeSuccess(action.employeeId, action.data));
  } catch (e) {
    yield put(patchUpdatePinCodeError());
    yield put(addSnackbar('Pin-code already exist', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* patchUpdatePinCodes(action) {
  try {
    const { data } = yield call(
      axios.patch,
      `${config.api.url}/company/${action.companyId}/kiosk/users/update-pin-codes`,
      action.data,
      getToken(),
    );
    yield put(patchUpdatePinCodesSuccess(data));
  } catch (e) {
    yield put(patchUpdatePinCodesError());
    yield put(addSnackbar('Pin-code already exist', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

function* getPinCodeGenerate(action) {
  try {
    const { data } = yield call(
      axios.get,
      `${config.api.url}/company/${action.companyId}/pin-code/generate`,
      getToken(),
    );
    yield put(getPinCodeGenerateSuccess(data));
  } catch (e) {
    yield put(getPinCodeGenerateError());
    yield put(addSnackbar('Something went wrong', 'error'));
    yield delay(4000);
    yield put(dismissSnackbar());
  }
}

export default function* KiosksWatcher() {
  yield takeLatest(GET_KIOSKS, getKiosks);
  yield takeLatest(POST_KIOSK, postKiosk);
  yield takeLatest(PATCH_KIOSK, patchKiosk);
  yield takeLatest(DELETE_KIOSK, deleteKiosk);
  yield takeLatest(GET_SETTINGS_PHOTO_TAKE, getSettingsPhotoTake);
  yield takeLatest(POST_SETTINGS_PHOTO_TAKE, postSettingsPhotoTake);
  yield takeLatest(GET_KIOSKS_USERS, getKiosksUsers);
  yield takeLatest(PATCH_UPDATE_STATUS, patchUpdateStatus);
  yield takeLatest(PATCH_UPDATE_PIN_CODE, patchUpdatePinCode);
  yield takeLatest(PATCH_UPDATE_PIN_CODES, patchUpdatePinCodes);
  yield takeLatest(POST_KIOSK_CHANGE_PASSWORD, postKioskChangePassword);
  yield takeLatest(GET_PIN_CODE_GENERATE, getPinCodeGenerate);
}
