import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  group: {
    created: {},
    modified: {},
    properties: {
      users: [],
    },
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UPDATE_GROUP_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.UPDATE_GROUP_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        group: action.payload,
      };
    case types.UPDATE_GROUP_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
