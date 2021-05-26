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
  GET_PIN_CODE_GENERATE,
  GET_PIN_CODE_GENERATE_SUCCESS,
  GET_PIN_CODE_GENERATE_ERROR,
  PATCH_UPDATE_PIN_CODES,
  PATCH_UPDATE_PIN_CODES_SUCCESS,
  PATCH_UPDATE_PIN_CODES_ERROR,
} from './types';

const initialState = {
  loading: false,
  kiosks: [],
  settingsPhotoTake: {},
  pinCodeGenerateLoading: false,
  pinCode: '',
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_KIOSKS:
    case POST_KIOSK:
    case PATCH_KIOSK:
    case DELETE_KIOSK:
    case POST_KIOSK_CHANGE_PASSWORD:
      return { ...state, loading: true };

    case GET_KIOSKS_ERROR:
    case POST_KIOSK_ERROR:
    case PATCH_KIOSK_ERROR:
    case DELETE_KIOSK_ERROR:
    case POST_KIOSK_CHANGE_PASSWORD_ERROR:
      return { ...state, loading: false };

    case GET_KIOSKS_SUCCESS:
      return {
        ...state,
        loading: false,
        kiosks: action.data,
      };

    case POST_KIOSK_SUCCESS: {
      return {
        ...state,
        loading: false,
        kiosks: [
          ...state.kiosks,
          action.data,
        ],
      };
    }

    case PATCH_KIOSK_SUCCESS: {
      const itemIndex = state.kiosks.findIndex((item) => item.id === action.data.id);
      return {
        ...state,
        kiosks: [
          ...state.kiosks.slice(0, itemIndex),
          {
            ...state.kiosks[itemIndex],
            ...action.data,
          },
          ...state.kiosks.slice(itemIndex + 1),
        ],
        loading: false,
      };
    }

    case POST_KIOSK_CHANGE_PASSWORD_SUCCESS: {
      const itemIndex = state.kiosks.findIndex((item) => item.id === action.id);
      return {
        ...state,
        kiosks: [
          ...state.kiosks.slice(0, itemIndex),
          {
            ...state.kiosks[itemIndex],
            ...action.data,
          },
          ...state.kiosks.slice(itemIndex + 1),
        ],
        loading: false,
      };
    }

    case DELETE_KIOSK_SUCCESS: {
      const itemIndex = state.kiosks.findIndex((item) => item.id === action.id);
      return {
        ...state,
        kiosks: [
          ...state.kiosks.slice(0, itemIndex),
          ...state.kiosks.slice(itemIndex + 1),
        ],
        loading: false,
      };
    }

    case GET_SETTINGS_PHOTO_TAKE:
    case POST_SETTINGS_PHOTO_TAKE:
      return { ...state, loadingSettingsPhotoTake: true };

    case GET_SETTINGS_PHOTO_TAKE_ERROR:
    case POST_SETTINGS_PHOTO_TAKE_ERROR:
      return { ...state, loadingSettingsPhotoTake: false };

    case GET_SETTINGS_PHOTO_TAKE_SUCCESS:
      return {
        ...state,
        loadingSettingsPhotoTake: false,
        settingsPhotoTake: action.data,
      };

    case POST_SETTINGS_PHOTO_TAKE_SUCCESS:
      return {
        ...state,
        loadingSettingsPhotoTake: false,
      };

    case GET_KIOSKS_USERS:
    case PATCH_UPDATE_STATUS:
    case PATCH_UPDATE_PIN_CODE:
    case PATCH_UPDATE_PIN_CODES:
      return { ...state, usersLoading: true };

    case PATCH_UPDATE_PIN_CODE_ERROR:
    case PATCH_UPDATE_STATUS_ERROR:
    case GET_KIOSKS_USERS_ERROR:
    case PATCH_UPDATE_PIN_CODES_ERROR:
      return { ...state, usersLoading: false };

    case GET_KIOSKS_USERS_SUCCESS:
      return {
        ...state,
        usersLoading: false,
        users: action.data,
      };

    case PATCH_UPDATE_STATUS_SUCCESS: {
      return {
        ...state,
        usersLoading: false,
        users: {
          stats: state.users.stats,
          employees: state.users.employees.map((item) => {
            if (action.data.employee_ids.includes(item.id)) {
              return ({
                ...item,
                is_kiosk: Number(action.data.status),
              });
            }

            return item;
          }),
        },
      };
    }

    case PATCH_UPDATE_PIN_CODE_SUCCESS: {
      const itemIndex = state.users.employees.findIndex((item) => item.id === action.employeeId);
      return {
        ...state,
        users: {
          stats: state.users.stats,
          employees: [
            ...state.users.employees.slice(0, itemIndex),
            {
              ...state.users.employees[itemIndex],
              ...action.data,
            },
            ...state.users.employees.slice(itemIndex + 1),
          ],
        },
        usersLoading: false,
      };
    }

    case PATCH_UPDATE_PIN_CODES_SUCCESS:
      return {
        ...state,
        usersLoading: false,
        users: {
          stats: state.users.stats,
          employees: state.users.employees.map((item) => {
            const foundItem = action.data.find((itemJ) => itemJ.data.id === item.id);
            if (foundItem) {
              return ({
                ...item,
                pin_code: foundItem.pin_code,
              });
            }

            return item;
          }),
        },
      };

    case GET_PIN_CODE_GENERATE:
      return { ...state, pinCodeGenerateLoading: true };
    case GET_PIN_CODE_GENERATE_SUCCESS:
      return {
        ...state,
        pinCode: action.data.pin_code,
        pinCodeGenerateLoading: false,
      };
    case GET_PIN_CODE_GENERATE_ERROR:
      return { ...state, pinCodeGenerateLoading: false };

    default: return state;
  }
};

export default reducer;
