import {
  FETCH_PROVIDERS_PENDING,
  FETCH_PROVIDERS_REJECTED,
  FETCH_PROVIDERS_FULFILLED,
  PROVIDERS_UNLOADED,
  DELETE_PROVIDER_PENDING,
  DELETE_PROVIDER_FULFILLED,
  DELETE_PROVIDER_REJECTED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  providers: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PROVIDERS_UNLOADED:
      return initialState;
    case FETCH_PROVIDERS_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_PROVIDERS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        providers: action.payload,
      };
    case FETCH_PROVIDERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case DELETE_PROVIDER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case DELETE_PROVIDER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case DELETE_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

