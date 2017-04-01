import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  policies: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UNLOAD_POLICIES:
      return initialState;
    case types.FETCH_POLICIES_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.FETCH_POLICIES_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        policies: action.payload
      };
    case types.FETCH_POLICIES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case types.DELETE_POLICIES_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_POLICY_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_POLICY_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case types.DELETE_POLICY_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

