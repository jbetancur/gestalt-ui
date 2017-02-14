import {
    FETCH_USER_PENDING,
    FETCH_USER_REJECTED,
    FETCH_USER_FULFILLED,
    CREATE_USER_PENDING,
    CREATE_USER_FULFILLED,
    CREATE_USER_REJECTED,
    USER_UNLOADED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  user: {
    created: {},
    modified: {},
    properties: {}
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_UNLOADED:
      return initialState;
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
        user: action.payload
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
        user: action.payload,
      };
    case CREATE_USER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
