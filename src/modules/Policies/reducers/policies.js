import {
  FETCH_POLICIES_PENDING,
  FETCH_POLICIES_REJECTED,
  FETCH_POLICIES_FULFILLED,
  POLICIES_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  policies: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POLICIES_UNLOADED:
      return initialState;
    case FETCH_POLICIES_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_POLICIES_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        policies: action.payload
      };
    case FETCH_POLICIES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};

