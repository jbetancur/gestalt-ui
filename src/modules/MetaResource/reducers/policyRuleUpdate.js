import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  policyRule: {
    created: {},
    modified: {},
    properties: {
      actions: [],
      eval_logic: {}
    }
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UPDATE_POLICYRULE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.UPDATE_POLICYRULE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        policyRule: action.payload,
      };
    case types.UPDATE_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
