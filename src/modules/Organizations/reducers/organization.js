import {
  FETCH_ORG_PENDING,
  FETCH_ORG_REJECTED,
  FETCH_ORG_FULFILLED,
  CREATE_ORG_PENDING,
  CREATE_ORG_FULFILLED,
  CREATE_ORG_REJECTED,
  UPDATE_ORG_PENDING,
  UPDATE_ORG_FULFILLED,
  UPDATE_ORG_REJECTED,
  DELETE_ORG_PENDING,
  DELETE_ORG_FULFILLED,
  DELETE_ORG_REJECTED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  item: {
    org: {},
    created: {},
    modified: {},
    properties: {
      env: {}
    }
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORG_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload,
      };
    case FETCH_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case CREATE_ORG_PENDING:
      return {
        ...state,
        pending: true
      };
    case CREATE_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload,
      };
    case CREATE_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UPDATE_ORG_PENDING:
      return {
        ...state,
        pending: true
      };
    case UPDATE_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload,
      };
    case UPDATE_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case DELETE_ORG_PENDING:
      return {
        ...state,
        pending: true
      };
    case DELETE_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case DELETE_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
