import {
  FETCH_APIENDPOINTS_PENDING,
  FETCH_APIENDPOINTS_REJECTED,
  FETCH_APIENDPOINTS_FULFILLED,
  APIENDPOINTS_UNLOADED,
  DELETE_APIENDPOINT_PENDING,
  DELETE_APIENDPOINT_FULFILLED,
  DELETE_APIENDPOINT_REJECTED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  apiEndpoints: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case APIENDPOINTS_UNLOADED:
      return initialState;
    case FETCH_APIENDPOINTS_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_APIENDPOINTS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        apiEndpoints: action.payload
      };
    case FETCH_APIENDPOINTS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case DELETE_APIENDPOINT_PENDING:
      return {
        ...state,
        pending: true,
      };
    case DELETE_APIENDPOINT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case DELETE_APIENDPOINT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

