import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  users: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UNLOAD_USERS:
      return initialState;
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_USERS_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.FETCH_USERS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        users: action.payload
      };
    case types.FETCH_USERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case types.DELETE_USERS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_USER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_USER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case types.DELETE_USER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

