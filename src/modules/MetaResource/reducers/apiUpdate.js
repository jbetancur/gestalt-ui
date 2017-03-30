import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  api: {
    created: {},
    modified: {},
    properties: {
      provider: {},
    }
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UPDATE_API_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.UPDATE_API_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        api: action.payload,
      };
    case types.UPDATE_API_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
