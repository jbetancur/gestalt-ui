import {
    FETCH_CONTAINER_PENDING,
    FETCH_CONTAINER_REJECTED,
    FETCH_CONTAINER_FULFILLED,
    CREATE_CONTAINER_PENDING,
    CREATE_CONTAINER_FULFILLED,
    CREATE_CONTAINER_REJECTED,
    CONTAINER_UNLOADED,
} from '../actionTypes';

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
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTAINER_UNLOADED:
      return initialState;
    case FETCH_CONTAINER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_CONTAINER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        container: action.payload
      };
    case FETCH_CONTAINER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CREATE_CONTAINER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case CREATE_CONTAINER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        container: action.payload,
      };
    case CREATE_CONTAINER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
