import {
  FETCH_USERS_PENDING,
  FETCH_USERS_REJECTED,
  FETCH_USERS_FULFILLED,
  USERS_UNLOADED,
  DELETE_USER_PENDING,
  DELETE_USER_FULFILLED,
  DELETE_USER_REJECTED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  users: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USERS_UNLOADED:
      return initialState;
    case FETCH_USERS_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_USERS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        users: action.payload
      };
    case FETCH_USERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case DELETE_USER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case DELETE_USER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case DELETE_USER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

