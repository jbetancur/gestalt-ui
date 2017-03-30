import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  lambda: {
    created: {},
    modified: {},
    properties: {
      env: {},
      headers: {},
      providers: [],
      periodic_info: {
        payload: {},
      },
    },
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_LAMBDA_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_LAMBDA_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        lambda: action.payload
      };
    case types.FETCH_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.CREATE_LAMBDA_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.CREATE_LAMBDA_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        lambda: action.payload,
      };
    case types.CREATE_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
