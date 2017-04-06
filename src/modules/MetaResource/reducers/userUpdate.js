import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  user: {
    created: {},
    modified: {},
    properties: {},
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UPDATE_USER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.UPDATE_USER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        user: action.payload,
      };
    case types.UPDATE_USER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
