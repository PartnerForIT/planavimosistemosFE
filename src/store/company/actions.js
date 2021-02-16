import {
  GET_ORGANISATION_MODULES,
} from './types';

const getOrganisationModules = (companyId) => ({
  type: GET_ORGANISATION_MODULES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/modules`,
  },
  meta: {
    thunk: true,
  },
});

export default getOrganisationModules;
