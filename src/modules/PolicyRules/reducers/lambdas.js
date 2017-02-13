import {
  FETCH_LAMBDAS_PENDING,
  FETCH_LAMBDAS_FULFILLED,
  FETCH_LAMBDAS_REJECTED,
  LAMBDAS_UNLOADED,
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
    default:
      return state;
  }
};
