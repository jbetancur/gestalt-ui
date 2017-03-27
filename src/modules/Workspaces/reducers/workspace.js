import * as metaTypes from 'modules/MetaResource/actionTypes';
import {
  CREATE_WORKSPACE_PENDING,
  CREATE_WORKSPACE_FULFILLED,
  CREATE_WORKSPACE_REJECTED,
  UPDATE_WORKSPACE_PENDING,
  UPDATE_WORKSPACE_FULFILLED,
  UPDATE_WORKSPACE_REJECTED,
  DELETE_WORKSPACE_PENDING,
  DELETE_WORKSPACE_FULFILLED,
  DELETE_WORKSPACE_REJECTED,
  WORKSPACE_UNLOADED,
} from '../actionTypes';

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
    case WORKSPACE_UNLOADED:
      return initialState;
    case metaTypes.FETCH_WORKSPACE_PENDING:
      return {
        ...state,
        pending: true,
      };
    case metaTypes.FETCH_WORKSPACE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        workspace: action.payload,
      };
    case metaTypes.FETCH_WORKSPACE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CREATE_WORKSPACE_PENDING:
      return {
        ...state,
        pending: true,
      };
    case CREATE_WORKSPACE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        workspace: action.payload,
      };
    case CREATE_WORKSPACE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UPDATE_WORKSPACE_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_WORKSPACE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        workspace: action.payload,
      };
    case UPDATE_WORKSPACE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case DELETE_WORKSPACE_PENDING:
      return {
        ...state,
        pending: true
      };
    case DELETE_WORKSPACE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case DELETE_WORKSPACE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};

