import {
  GET_SKILLS,
} from './types';

export const getSkills = () => ({
  type: GET_SKILLS,
  request: {
    method: 'GET',
    url: '/skills',
  },
  meta: {
    thunk: true,
  },
});