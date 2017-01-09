import {
    FETCH_USER_PENDING,
    FETCH_USER_REJECTED,
    FETCH_USER_FULFILLED,
    CREATE_USER_PENDING,
    CREATE_USER_FULFILLED,
    CREATE_USER_REJECTED,
    DELETE_USER_PENDING,
    DELETE_USER_FULFILLED,
    DELETE_USER_REJECTED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  item: {
    created: {},
    modified: {},
    properties: {}
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_USER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload
      };
    case FETCH_USER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CREATE_USER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case CREATE_USER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload,
      };
    case CREATE_USER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
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
