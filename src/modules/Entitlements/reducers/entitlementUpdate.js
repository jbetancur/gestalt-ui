import {
  UPDATE_ENTITLEMENTS_PENDING,
  UPDATE_ENTITLEMENTS_FULFILLED,
  UPDATE_ENTITLEMENTS_REJECTED,
  ENTITLEMENTS_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  entitlement: {},
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ENTITLEMENTS_UNLOADED:
      return initialState;
    case UPDATE_ENTITLEMENTS_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_ENTITLEMENTS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        entitlement: action.payload,
      };
    case UPDATE_ENTITLEMENTS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

