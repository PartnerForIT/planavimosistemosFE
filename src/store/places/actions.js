import {
  GET_PLACES,
} from './types';
import { makeQueryString } from '../../components/Helpers';

export const getPlaces = () => ({
  type: GET_PLACES,
  request: {
    method: 'GET',
    url: '/places',
  },
  meta: {
    thunk: true,
  },
});

export const getReportsPlaces = (queryObj) => ({
  type: GET_PLACES,
  request: {
    method: 'GET',
    url: `/company/${queryObj.company_id}/reports/places?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});
