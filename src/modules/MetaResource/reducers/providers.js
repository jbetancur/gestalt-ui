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
    case types.UNLOAD_PROVIDERS:
      return initialState;
    case types.FETCH_PROVIDERS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_PROVIDERS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        providers: action.payload,
      };
    case types.FETCH_PROVIDERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.DELETE_PROVIDERS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_PROVIDER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_PROVIDER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case types.DELETE_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

