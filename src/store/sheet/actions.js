import {
  GET_SHEET,
  GET_SHEET_SUCCESS,
  GET_SHEET_ERROR,
} from './types';

export const getSheet = ({
  companyId,
  fromDate,
  firstLoading,
}) => ({
  type: GET_SHEET,
  companyId,
  fromDate,
  firstLoading,
});
export const getSheetSuccess = (data) => ({
  type: GET_SHEET_SUCCESS,
  data,
});
export const getSheetError = () => ({
  type: GET_SHEET_ERROR,
});