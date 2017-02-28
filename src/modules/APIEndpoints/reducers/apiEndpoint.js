import {
    FETCH_APIENDPOINT_PENDING,
    FETCH_APIENDPOINT_REJECTED,
    FETCH_APIENDPOINT_FULFILLED,
    CREATE_APIENDPOINT_PENDING,
    CREATE_APIENDPOINT_FULFILLED,
    CREATE_APIENDPOINT_REJECTED,
    APIENDPOINT_UNLOADED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  apiEndpoint: {
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
    case FETCH_APIENDPOINT_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_APIENDPOINT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        apiEndpoint: action.payload
      };
    case FETCH_APIENDPOINT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CREATE_APIENDPOINT_PENDING:
      return {
        ...state,
        pending: true,
      };
    case CREATE_APIENDPOINT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        apiEndpoint: action.payload,
      };
    case CREATE_APIENDPOINT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
