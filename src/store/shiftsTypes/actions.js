import {
  GET_SHIFT_TYPES,
} from './types';

export const getShiftTypes = (companyId) => ({
  type: GET_SHIFT_TYPES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/shifts`,
  },
  meta: {
    thunk: true,
  },
});
