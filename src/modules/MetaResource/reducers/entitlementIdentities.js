import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  identities: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UNLOAD_ENTITLEMENTS:
      return initialState;
    case types.FETCH_IDENTITIES_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_IDENTITIES_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        identities: action.payload,
      };
    case types.FETCH_IDENTITIES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

