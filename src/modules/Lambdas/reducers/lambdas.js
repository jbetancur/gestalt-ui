import {
  FETCH_LAMBDAS_PENDING,
  FETCH_LAMBDAS_REJECTED,
  FETCH_LAMBDAS_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
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
        items: action.payload
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

