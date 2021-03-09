import {
  GET_PLACES,
} from './types';
import { makeQueryString } from '../../components/Helpers';

export const getPlaces = (companyId) => ({
  type: GET_PLACES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/places`,
  },
  meta: {
    thunk: true,
  },
});

export const getReportsPlaces = ({ companyId, ...rest }) => ({
  type: GET_PLACES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/reports/places?${makeQueryString(rest)}`,
  },
  meta: {
    thunk: true,
  },
});
