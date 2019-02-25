import { removeItemById, insertItem } from 'util/helpers/lists';
import {
  FETCH_PROVIDERS_REQUEST,
  FETCH_PROVIDERS_FULFILLED,
  FETCH_PROVIDERS_REJECTED,
  DELETE_PROVIDER_REQUEST,
  DELETE_PROVIDER_FULFILLED,
  DELETE_PROVIDER_REJECTED,
  CREATE_PROVIDERS_FULFILLED,
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

    // Insert container into lambda listing state
    case CREATE_PROVIDERS_FULFILLED:
      // only update if within the same environment context - see the saga createProviders for logic
      console.log(action);
      if (action.updateState) {
        return {
          ...state,
          providers: insertItem(state.providers, action.payload)
        };
      }

      return {
        ...state,
      };
    case UNLOAD_PROVIDERS:
      return initialState;
    default:
      return state;
  }
};
