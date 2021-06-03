import {
  GET_ORGANISATION_MODULES,
  POST_SUPPORT_TICKET,
  POST_SUPPORT_TICKET_SUCCESS,
  POST_SUPPORT_TICKET_ERROR,
  DONE_SUPPORT_TICKET,
} from './types';

export const getOrganisationModules = (companyId) => ({
  type: GET_ORGANISATION_MODULES,
  request: {
    method: 'GET',
    url: `/company/${companyId}/modules`,
  },
  meta: {
    thunk: true,
  },
});

export const postSupportTicket = ({ companyId, data }) => ({
  type: POST_SUPPORT_TICKET,
  companyId,
  data,
});
export const postSupportTicketSuccess = () => ({
  type: POST_SUPPORT_TICKET_SUCCESS,
});
export const postSupportTicketError = () => ({
  type: POST_SUPPORT_TICKET_ERROR,
});
export const doneSupportTicket = () => ({
  type: DONE_SUPPORT_TICKET,
});
