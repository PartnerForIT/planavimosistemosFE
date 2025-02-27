import {
  GET_CUSTOM_CATEGORIES,
  GET_CUSTOM_CATEGORIES_VALUES,
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

export const getCustomCategoriesValues = (companyId) => ({
  type: GET_CUSTOM_CATEGORIES_VALUES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/custom_categories/values`,
  },
  meta: {
    thunk: true,
  },
});