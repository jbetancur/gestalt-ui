import { LOCATION_CHANGE } from 'react-router-redux';
import {
  FETCH_PROVIDERS_REQUEST,
  FETCH_PROVIDERS_FULFILLED,
  FETCH_PROVIDERS_REJECTED,
  // UNLOAD_LAMBDA,
} from '../actionTypes';

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
    case FETCH_PROVIDERS_REQUEST:
      return {
        ...state,
        providers: action.payload,
        pending: true,
      };
    case FETCH_PROVIDERS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        providers: action.payload,
      };
    case FETCH_PROVIDERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

