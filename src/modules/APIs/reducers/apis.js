import {
  FETCH_APIS_PENDING,
  FETCH_APIS_REJECTED,
  FETCH_APIS_FULFILLED,
  APIS_UNLOADED,
  DELETE_API_PENDING,
  DELETE_API_FULFILLED,
  DELETE_API_REJECTED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  apis: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case APIS_UNLOADED:
      return initialState;
    case FETCH_APIS_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_APIS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        apis: action.payload
      };
    case FETCH_APIS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case DELETE_API_PENDING:
      return {
        ...state,
        pending: true,
      };
    case DELETE_API_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case DELETE_API_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

