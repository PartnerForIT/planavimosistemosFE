import {
  GET_PLACES,
  GET_PLACE,
} from './types';

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

export const getPlace = (id) => ({
  type: GET_PLACE,
  request: {
    method: 'GET',
    url: `/place/${id}`,
  },
  meta: {
    thunk: true,
  },
});
