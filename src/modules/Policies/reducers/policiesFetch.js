import {
  FETCH_POLICIES_PENDING,
  FETCH_POLICIES_REJECTED,
  FETCH_POLICIES_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
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
        items: action.payload
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

