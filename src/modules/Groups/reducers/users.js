import {
  FETCH_USERS_PENDING,
  FETCH_USERS_REJECTED,
  FETCH_USERS_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  users: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

