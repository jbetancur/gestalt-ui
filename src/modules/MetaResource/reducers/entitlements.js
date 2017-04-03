import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  entitlements: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UNLOAD_ENTITLEMENTS:
      return initialState;
    case types.FETCH_ENTITLEMENTS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_ENTITLEMENTS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        entitlements: action.payload,
      };
    case types.FETCH_ENTITLEMENTS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.UDPATE_ENTITLEMENT_TOGGLE_STATE:
      return {
        ...state,
        entitlements: action.payload,
      };
    default:
      return state;
  }
};

