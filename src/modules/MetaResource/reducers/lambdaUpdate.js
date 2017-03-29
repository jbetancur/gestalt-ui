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
    },
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UPDATE_LAMBDA_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.UPDATE_LAMBDA_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        lambda: action.payload,
      };
    case types.UPDATE_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
