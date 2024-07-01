import { success } from 'redux-saga-requests';
import {
  GET_SHEET,
  GET_SHEET_ERROR,

  GET_INTEGRATION,
  GET_INTEGRATION_ERROR,
} from './types';
import {ADD_SNACKBAR} from "../organizationList/types";

const initialState = {
  schedule: null,
  resources: null,
  loading: false,
};

// eslint-disable-next-line
const mergeArraysById = (primaryArray, secondaryArray, idKey) => {
  const primaryMap = new Map(primaryArray.map(item => [item[idKey], item]));
  for (const item of secondaryArray) {
    if (!primaryMap.has(item[idKey])) {
      primaryArray.push(item);
    }
  }
  return primaryArray;
};

const mergeData = (state, newData) => {
  const mergedState = { ...state };

  mergedState.sheet = newData;

  //mergedState.sheet.places = mergeArraysById([...(state.sheet?.places ?? [])], newData?.places ?? [], 'id');
  //mergedState.sheet.resources = mergeArraysById([...(state.sheet?.resources ?? [])], newData?.resources ?? [], 'id');
  //mergedState.sheet.sheet = mergeArraysById([...(state.sheet?.sheet ?? [])], newData?.sheet ?? [], 'id');

  return mergedState;
};


export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SHEET:
      return { ...state, loading: true };
    case success(GET_SHEET):
      return {
        ...mergeData(state, action.data),
        //...state,
        //sheet: action.data,
        //resources: action.data.resources,
        loading: false,
      };
    case GET_SHEET_ERROR:
      return { ...state, loading: false };


    case GET_INTEGRATION:
      return { ...state, loading: true };
    case success(GET_INTEGRATION):
      return {
        ...state,
        //data: action.data,
        loading: false,
      };
    case GET_INTEGRATION_ERROR:
      return { ...state, loading: false };

    case ADD_SNACKBAR:
      return {
        ...state,
       loading: false
      };

    default: return state;
  }
};

export default reducer;
