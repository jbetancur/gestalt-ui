import {
    UPDATE_LAMBDA_PENDING,
    UPDATE_LAMBDA_FULFILLED,
    UPDATE_LAMBDA_REJECTED,
    LAMBDA_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  lambda: {
    created: {},
    modified: {},
    properties: {
      env: {},
      headers: {},
      providers: [],
    },
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LAMBDA_UNLOADED:
      return initialState;
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
        lambda: action.payload,
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
