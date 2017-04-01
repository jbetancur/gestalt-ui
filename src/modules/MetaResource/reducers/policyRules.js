import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  policyRules: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UNLOAD_POLICYRULES:
      return initialState;
    case types.FETCH_POLICYRULES_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.FETCH_POLICYRULES_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        policyRules: action.payload
      };
    case types.FETCH_POLICYRULES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case types.DELETE_POLICYRULES_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_POLICYRULE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_POLICYRULE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case types.DELETE_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

