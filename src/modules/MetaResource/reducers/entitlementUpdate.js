import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  entitlement: {},
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UNLOAD_ENTITLEMENTS:
      return initialState;
    case types.UPDATE_ENTITLEMENT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.UPDATE_ENTITLEMENT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        entitlement: action.payload,
      };
    case types.UPDATE_ENTITLEMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

