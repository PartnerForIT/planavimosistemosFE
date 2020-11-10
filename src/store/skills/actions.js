import {
  GET_SKILLS,
} from './types';
import { makeQueryString } from '../../components/Helpers';

export const getSkills = (companyId) => ({
  type: GET_SKILLS,
  request: {
    method: 'GET',
    url: `/company/${companyId}/skills`,
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
