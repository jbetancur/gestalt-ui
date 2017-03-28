import * as types from '../actionTypes';

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
    case types.UNLOAD_ORG:
      return initialState;
    case types.FETCH_ORG_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.FETCH_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organization: action.payload,
      };
    case types.FETCH_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case types.CREATE_ORG_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.CREATE_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organization: action.payload,
      };
    case types.CREATE_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.UPDATE_ORG_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.UPDATE_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organization: action.payload,
      };
    case types.UPDATE_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case types.DELETE_ORG_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.DELETE_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case types.DELETE_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
