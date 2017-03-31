import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  lambdas: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UNLOAD_LAMBDAS:
      return initialState;
    case types.FETCH_LAMBDAS_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.FETCH_LAMBDAS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        lambdas: action.payload
      };
    case types.FETCH_LAMBDAS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case types.DELETE_LAMBDAS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_LAMBDA_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_LAMBDA_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case types.DELETE_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

