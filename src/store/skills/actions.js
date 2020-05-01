import {
  GET_SKILLS,
} from './types';
import { makeQueryString } from '../../components/Helpers';

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

export const getReportsSkills = (queryObj) => ({
  type: GET_SKILLS,
  request: {
    method: 'GET',
    url: `/reports/skills?${makeQueryString(queryObj)}`,
  },
  meta: {
    thunk: true,
  },
});
