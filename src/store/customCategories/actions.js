import {
  GET_CUSTOM_CATEGORIES,
} from './types';

export const getCustomCategories = (companyId) => ({
  type: GET_CUSTOM_CATEGORIES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/custom_categories`,
  },
  meta: {
    thunk: true,
  },
});