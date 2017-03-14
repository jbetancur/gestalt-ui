import {
  FETCH_SELF_PENDING,
  FETCH_SELF_REJECTED,
  FETCH_SELF_FULFILLED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  error: null,
  self: {
    properties: {
      gestalt_home: {
        org: {},
        created: {},
        modified: {},
        properties: {
          env: {}
        },
      }
    }
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SELF_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_SELF_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        self: action.payload
      };
    case FETCH_SELF_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
