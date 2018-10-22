import { removeItemById } from 'util/helpers/lists';
import {
  FETCH_STREAMSPECS_REQUEST,
  FETCH_STREAMSPECS_FULFILLED,
  FETCH_STREAMSPECS_REJECTED,
  DELETE_STREAMSPEC_REQUEST,
  DELETE_STREAMSPEC_FULFILLED,
  DELETE_STREAMSPEC_REJECTED,
  DELETE_STREAMSPECS_REQUEST, // bulk delete
  DELETE_STREAMSPECS_FULFILLED,
  DELETE_STREAMSPECS_REJECTED,
  UNLOAD_STREAMSPECS,
} from '../constants';

const initialState = {
  streamSpecs: [],
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STREAMSPECS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_STREAMSPECS_FULFILLED:
      return {
        ...state,
        streamSpecs: action.payload,
        pending: false,
        completed: true,
      };
    case FETCH_STREAMSPECS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_STREAMSPECS_REQUEST:
      return {
        ...state,
        pending: true,
      };

    case DELETE_STREAMSPEC_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DELETE_STREAMSPEC_FULFILLED:
      return {
        ...state,
        streamSpecs: removeItemById(state.streamSpecs, action.payload.id),
        pending: false,
        completed: true,
      };
    case DELETE_STREAMSPECS_FULFILLED:
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          streamSpecs: state.streamSpecs.filter(item => action.payload.find(i => i.id === item.id) !== item),
          pending: false,
          completed: true,
        };
      }

      return {
        ...state,
        pending: false,
      };
    case DELETE_STREAMSPEC_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case DELETE_STREAMSPECS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UNLOAD_STREAMSPECS:
      return initialState;
    default:
      return state;
  }
};
