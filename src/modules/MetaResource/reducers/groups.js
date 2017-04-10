import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  groups: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UNLOAD_GROUPS:
      return initialState;
    case types.FETCH_GROUPS_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.FETCH_GROUPS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        groups: action.payload
      };
    case types.FETCH_GROUPS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case types.DELETE_GROUPS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_GROUP_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_GROUP_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case types.DELETE_GROUP_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

