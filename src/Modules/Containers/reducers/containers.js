import { insertItem, removeItemById } from 'util/helpers/lists';
import {
  FETCH_CONTAINERS_REQUEST,
  FETCH_CONTAINERS_FULFILLED,
  FETCH_CONTAINERS_REJECTED,
  DELETE_CONTAINER_REQUEST,
  DELETE_CONTAINER_FULFILLED,
  DELETE_CONTAINER_REJECTED,
  UNLOAD_CONTAINERS,
  CREATE_CONTAINERS_FULFILLED,
} from '../actionTypes';

const initialState = {
  containers: [],
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONTAINERS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_CONTAINERS_FULFILLED:
      return {
        ...state,
        containers: action.payload,
        pending: false,
        completed: true,
      };
    case FETCH_CONTAINERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    // Insert container into container listing state
    case CREATE_CONTAINERS_FULFILLED:
      // only update if within the same environment context - see the saga createContainerFromListing for logic
      if (action.updateState) {
        return {
          ...state,
          containers: insertItem(state.containers, action.payload)
        };
      }

      return {
        ...state,
      };

    case DELETE_CONTAINER_REQUEST:
      return {
        ...state,
        pending: true,
      };

    case DELETE_CONTAINER_FULFILLED:
      // delete container into container listing state
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          containers: state.containers.filter(item => action.payload.find(i => i.id === item.id) !== item),
          pending: false,
          completed: true,
        };
      }

      return {
        ...state,
        containers: removeItemById(state.containers, action.payload.id),
        pending: false,
        completed: true,
      };
    case DELETE_CONTAINER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UNLOAD_CONTAINERS:
      return initialState;
    default:
      return state;
  }
};
