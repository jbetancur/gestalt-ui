import {
  FETCH_ENTITLEMENTS_PENDING,
  FETCH_ENTITLEMENTS_REJECTED,
  FETCH_ENTITLEMENTS_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ENTITLEMENTS_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_ENTITLEMENTS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        items: action.payload
      };
    case FETCH_ENTITLEMENTS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};

