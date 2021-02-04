import {
  GET_INFO,
} from './types';

const getCompanyInfo = (token) => ({
  type: GET_INFO,
  request: {
    method: 'GET',
    url: `/find/${token}`,
  },
  meta: {
    thunk: true,
  },
});

export default getCompanyInfo;
