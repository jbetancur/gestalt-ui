import { removeItemById } from 'util/helpers/lists';
import {
  FETCH_PROVIDERS_REQUEST,
  FETCH_PROVIDERS_FULFILLED,
  FETCH_PROVIDERS_REJECTED,
  DELETE_PROVIDER_REQUEST,
  DELETE_PROVIDER_FULFILLED,
  DELETE_PROVIDER_REJECTED,
  UNLOAD_PROVIDERS,
} from '../actionTypes';

const initialState = {
  providers: [],
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROVIDERS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_PROVIDERS_FULFILLED:
      return {
        ...state,
        providers: action.payload,
        pending: false,
        completed: true,
      };
    case FETCH_PROVIDERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case DELETE_PROVIDER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DELETE_PROVIDER_FULFILLED:
      return {
        ...state,
        providers: removeItemById(state.providers, action.payload.id),
        pending: false,
        completed: true,
      };
    case DELETE_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UNLOAD_PROVIDERS:
      return initialState;
    default:
      return state;
  }
};
