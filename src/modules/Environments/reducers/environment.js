import {
    FETCH_ENVIRONMENT_PENDING,
    FETCH_ENVIRONMENT_REJECTED,
    FETCH_ENVIRONMENT_FULFILLED,
    CREATE_ENVIRONMENT_PENDING,
    CREATE_ENVIRONMENT_FULFILLED,
    CREATE_ENVIRONMENT_REJECTED,
    UPDATE_ENVIRONMENT_PENDING,
    UPDATE_ENVIRONMENT_FULFILLED,
    UPDATE_ENVIRONMENT_REJECTED,
    DELETE_ENVIRONMENT_PENDING,
    DELETE_ENVIRONMENT_FULFILLED,
    DELETE_ENVIRONMENT_REJECTED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  item: {
    created: {},
    modified: {},
    properties: {
      env: {}
    }
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ENVIRONMENT_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_ENVIRONMENT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload
      };
    case FETCH_ENVIRONMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CREATE_ENVIRONMENT_PENDING:
      return {
        ...state,
        pending: true,
      };
    case CREATE_ENVIRONMENT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload,
      };
    case CREATE_ENVIRONMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UPDATE_ENVIRONMENT_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_ENVIRONMENT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload,
      };
    case UPDATE_ENVIRONMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case DELETE_ENVIRONMENT_PENDING:
      return {
        ...state,
        pending: true
      };
    case DELETE_ENVIRONMENT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case DELETE_ENVIRONMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
