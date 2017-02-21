import {
    FETCH_ENV_PENDING,
    FETCH_ENV_REJECTED,
    FETCH_ENV_FULFILLED,
    CONTAINER_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  env: {},
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTAINER_UNLOADED:
      return initialState;
    case FETCH_ENV_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_ENV_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        env: action.payload
      };
    case FETCH_ENV_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
