import {
    UPDATE_APIENDPOINT_PENDING,
    UPDATE_APIENDPOINT_FULFILLED,
    UPDATE_APIENDPOINT_REJECTED,
    APIENDPOINT_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  apiendpoint: {
    created: {},
    modified: {},
    properties: {
      auth_type: {},
      implementation: {},
    },
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case APIENDPOINT_UNLOADED:
      return initialState;
    case UPDATE_APIENDPOINT_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_APIENDPOINT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        apiEndpoint: action.payload,
      };
    case UPDATE_APIENDPOINT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
