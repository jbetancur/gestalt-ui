import {
  FETCH_CONTAINERS_PENDING,
  FETCH_CONTAINERS_REJECTED,
  FETCH_CONTAINERS_FULFILLED,
  CONTAINERS_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  containers: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTAINERS_UNLOADED:
      return initialState;
    case FETCH_CONTAINERS_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_CONTAINERS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        containers: action.payload,
      };
    case FETCH_CONTAINERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

