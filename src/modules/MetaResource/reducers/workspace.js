import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  workspace: {
    created: {},
    modified: {},
    owner: {},
    properties: {
      env: {}
    }
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UNLOAD_WORKSPACE:
      return initialState;
    case types.FETCH_WORKSPACE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_WORKSPACE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        workspace: action.payload,
      };
    case types.FETCH_WORKSPACE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.CREATE_WORKSPACE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.CREATE_WORKSPACE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        workspace: action.payload,
      };
    case types.CREATE_WORKSPACE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.UPDATE_WORKSPACE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.UPDATE_WORKSPACE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        workspace: action.payload,
      };
    case types.UPDATE_WORKSPACE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.DELETE_WORKSPACE_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.DELETE_WORKSPACE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case types.DELETE_WORKSPACE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};

