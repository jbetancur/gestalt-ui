import * as metaTypes from 'modules/MetaResource/actionTypes';
import {
  ORG_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  organization: {
    org: {},
    created: {},
    modified: {},
    owner: {},
    properties: {
      env: {}
    }
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ORG_UNLOADED:
      return initialState;
    case metaTypes.FETCH_ORG_PENDING:
      return {
        ...state,
        pending: true
      };
    case metaTypes.FETCH_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organization: action.payload,
      };
    case metaTypes.FETCH_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case metaTypes.CREATE_ORG_PENDING:
      return {
        ...state,
        pending: true
      };
    case metaTypes.CREATE_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organization: action.payload,
      };
    case metaTypes.CREATE_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case metaTypes.UPDATE_ORG_PENDING:
      return {
        ...state,
        pending: true
      };
    case metaTypes.UPDATE_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organization: action.payload,
      };
    case metaTypes.UPDATE_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case metaTypes.DELETE_ORG_PENDING:
      return {
        ...state,
        pending: true
      };
    case metaTypes.DELETE_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case metaTypes.DELETE_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
