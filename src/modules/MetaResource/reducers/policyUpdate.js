import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  policy: {
    created: {},
    modified: {},
    properties: {}
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UPDATE_POLICY_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.UPDATE_POLICY_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        policy: action.payload,
      };
    case types.UPDATE_POLICY_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
