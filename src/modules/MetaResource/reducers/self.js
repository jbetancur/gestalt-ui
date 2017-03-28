import * as types from '../actionTypes';

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
    case types.FETCH_SELF_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.FETCH_SELF_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        self: action.payload
      };
    case types.FETCH_SELF_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
