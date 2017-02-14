import {
  FETCH_LAMBDAS_PENDING,
  FETCH_LAMBDAS_REJECTED,
  FETCH_LAMBDAS_FULFILLED,
  LAMBDAS_UNLOADED,
  DELETE_LAMBDA_PENDING,
  DELETE_LAMBDA_FULFILLED,
  DELETE_LAMBDA_REJECTED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  lambdas: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LAMBDAS_UNLOADED:
      return initialState;
    case FETCH_LAMBDAS_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_LAMBDAS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        lambdas: action.payload
      };
    case FETCH_LAMBDAS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case DELETE_LAMBDA_PENDING:
      return {
        ...state,
        pending: true,
      };
    case DELETE_LAMBDA_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case DELETE_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

