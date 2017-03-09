import {
  FETCH_IDENTITIES_PENDING,
  FETCH_IDENTITIES_REJECTED,
  FETCH_IDENTITIES_FULFILLED,
  ENTITLEMENTS_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  identities: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ENTITLEMENTS_UNLOADED:
      return initialState;
    case FETCH_IDENTITIES_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_IDENTITIES_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        identities: action.payload,
      };
    case FETCH_IDENTITIES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

