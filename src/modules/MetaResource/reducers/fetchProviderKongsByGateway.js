import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  providers: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_PROVIDERS_KONG_GATEWAY_REQUEST:
      return {
        ...state,
        pending: true,
        providers: [{ id: '', name: 'fetching providers...' }],
      };
    case types.FETCH_PROVIDERS_KONG_GATEWAY_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        providers: action.payload,
      };
    case types.FETCH_PROVIDERS_KONG_GATEWAY_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

