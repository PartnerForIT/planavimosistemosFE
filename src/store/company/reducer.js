/* eslint-disable camelcase */
import { success, error } from 'redux-saga-requests';
import {
  DONE_SUPPORT_TICKET,
  GET_ORGANISATION_MODULES,
  POST_SUPPORT_TICKET,
  POST_SUPPORT_TICKET_ERROR,
  POST_SUPPORT_TICKET_SUCCESS,
} from './types';

const initialState = {
  modules: {},
  loading: false,
  requestWasSent: false,
  isCreateTicket: false,
  postSupportTicketLoading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORGANISATION_MODULES:
      return {
        ...state, error: null, loading: true, requestWasSent: true,
      };
    case success(GET_ORGANISATION_MODULES): {
      return { ...state, modules: action.data, loading: false };
    }
    case error(GET_ORGANISATION_MODULES): {
      return { ...state, error: action.error, loading: false };
    }

    case POST_SUPPORT_TICKET:
      return {
        ...state,
        postSupportTicketLoading: true,
      };
    case POST_SUPPORT_TICKET_ERROR:
      return {
        ...state,
        postSupportTicketLoading: false,
      };
    case POST_SUPPORT_TICKET_SUCCESS:
      return {
        ...state,
        isCreateTicket: true,
        postSupportTicketLoading: false,
      };
    case DONE_SUPPORT_TICKET:
      return {
        ...state,
        isCreateTicket: false,
      };
    default: return state;
  }
};

export default reducer;
