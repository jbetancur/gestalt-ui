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
    case types.ADD_GROUP_MEMBER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.ADD_GROUP_MEMBER_FULFILLED:
      return {
        ...state,
        pending: false,
        group: action.payload,
        completed: true
      };
    case types.ADD_GROUP_MEMBER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.REMOVE_GROUP_MEMBER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.REMOVE_GROUP_MEMBER_FULFILLED:
      return {
        ...state,
        pending: false,
        group: action.payload,
        completed: true
      };
    case types.REMOVE_GROUP_MEMBER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
