import {
  GET_OVERVIEW,
  GET_OVERVIEW_SUCCESS,
  GET_OVERVIEW_ERROR,
} from './types';

export const getOverview = () => ({
  type: GET_OVERVIEW,
});

export const getOverviewSuccess = (data) => ({
  type: GET_OVERVIEW_SUCCESS,
  data,
});

export const getOverviewError = (data) => ({
  type: GET_OVERVIEW_ERROR,
  data,
});
