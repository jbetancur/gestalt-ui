import {
    UPDATE_USER_PENDING,
    UPDATE_USER_FULFILLED,
    UPDATE_USER_REJECTED,
    USER_UNLOADED,
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
    case UPDATE_USER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_USER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload,
      };
    case UPDATE_USER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
