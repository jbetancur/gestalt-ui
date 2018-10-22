import {
  INIT_STREAMSPECEDIT_REQUEST,
  INIT_STREAMSPECCREATE_FULFILLED,
  INIT_STREAMSPECEDIT_FULFILLED,
  INIT_STREAMSPECEDIT_REJECTED,
  CREATE_STREAMSPEC_REQUEST,
  CREATE_STREAMSPEC_FULFILLED,
  CREATE_STREAMSPEC_REJECTED,
  UPDATE_STREAMSPEC_REQUEST,
  UPDATE_STREAMSPEC_FULFILLED,
  UPDATE_STREAMSPEC_REJECTED,
  DELETE_STREAMSPEC_REQUEST,
  DELETE_STREAMSPEC_FULFILLED,
  DELETE_STREAMSPEC_REJECTED,
  UNLOAD_STREAMSPEC,
} from '../constants';
import streamSpecModeol from '../models/streamSpec';

const initialState = {
  streamSpec: streamSpecModeol.get(),
  providers: [],
  datafeeds: [],
  lambdas: [],
  actions: [],
  instanceActions: [],
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_STREAMSPECCREATE_FULFILLED:
      return {
        ...state,
        providers: action.payload.providers,
        datafeeds: action.payload.datafeeds,
        lambdas: action.payload.lambdas,
      };
    case INIT_STREAMSPECEDIT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case INIT_STREAMSPECEDIT_FULFILLED:
      return {
        ...state,
        streamSpec: action.payload.streamSpec,
        providers: action.payload.providers,
        datafeeds: action.payload.datafeeds,
        lambdas: action.payload.lambdas,
        actions: action.payload.actions,
        instanceActions: action.payload.instanceActions,
        pending: false,
        completed: true,
      };
    case INIT_STREAMSPECEDIT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case CREATE_STREAMSPEC_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case CREATE_STREAMSPEC_FULFILLED:
      return {
        ...state,
        streamSpecs: action.payload,
        pending: false,
        completed: true,
      };
    case CREATE_STREAMSPEC_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case UPDATE_STREAMSPEC_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_STREAMSPEC_FULFILLED:
      return {
        ...state,
        streamSpecs: action.payload,
        pending: false,
        completed: true,
      };
    case UPDATE_STREAMSPEC_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_STREAMSPEC_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DELETE_STREAMSPEC_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case DELETE_STREAMSPEC_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UNLOAD_STREAMSPEC:
      return initialState;
    default:
      return state;
  }
};
