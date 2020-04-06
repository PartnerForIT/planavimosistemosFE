import {
  GET_SPECIALIZATIONS,
} from './types';

export const getSpecializations = () => ({
  type: GET_SPECIALIZATIONS,
  request: {
    method: 'GET',
    url: '/specializations',
  },
  meta: {
    thunk: true,
  },
});

export const getSpecialization = () => ({
  type: GET_SPECIALIZATIONS,
  request: {
    method: 'GET',
    url: '/specialization',
  },
  meta: {
    thunk: true,
  },
});
