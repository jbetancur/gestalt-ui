import {
    FETCH_LAMBDA_PENDING,
    FETCH_LAMBDA_REJECTED,
    FETCH_LAMBDA_FULFILLED,
    CREATE_LAMBDA_PENDING,
    CREATE_LAMBDA_FULFILLED,
    CREATE_LAMBDA_REJECTED,
    UPDATE_LAMBDA_PENDING,
    UPDATE_LAMBDA_FULFILLED,
    UPDATE_LAMBDA_REJECTED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  item: {
    created: {},
    modified: {},
    properties: {
      env: {},
      headers: {}
    }
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LAMBDA_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_LAMBDA_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload
      };
    case FETCH_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CREATE_LAMBDA_PENDING:
      return {
        ...state,
        pending: true,
      };
    case CREATE_LAMBDA_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload,
      };
    case CREATE_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UPDATE_LAMBDA_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_LAMBDA_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload,
      };
    case UPDATE_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
