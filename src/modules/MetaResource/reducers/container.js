import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  container: {
    created: {},
    modified: {},
    properties: {
      env: {},
      accepted_resource_roles: [],
      constraints: [],
      health_checks: [],
      instances: [],
      port_mappings: [],
      service_addresses: [],
      volumes: [],
      provider: {},
      force_pull: false,
    },
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_CONTAINER_REQUEST:
      return {
        ...state,
        // eslint-disable-next-line no-unneeded-ternary
        pending: action.isPolling ? false : true, // TODO: polling will be removed when we have SSE
      };
    case types.FETCH_PROVIDER_CONTAINER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_CONTAINER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        container: action.payload || initialState.container,
      };
    case types.FETCH_CONTAINER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.CREATE_CONTAINER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.CREATE_CONTAINER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        container: action.payload,
      };
    case types.CREATE_CONTAINER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.DELETE_CONTAINER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_CONTAINER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case types.DELETE_CONTAINER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
