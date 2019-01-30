import {
  INIT_CONTAINEREDIT_REQUEST,
  INIT_CONTAINERCREATE_FULFILLED,
  INIT_CONTAINEREDIT_FULFILLED,
  INIT_CONTAINEREDIT_REJECTED,
  FETCH_CONTAINER_REQUEST,
  FETCH_CONTAINER_FULFILLED,
  FETCH_CONTAINER_REJECTED,
  CREATE_CONTAINER_REQUEST,
  CREATE_CONTAINER_FULFILLED,
  CREATE_CONTAINER_REJECTED,
  UPDATE_CONTAINER_REQUEST,
  UPDATE_CONTAINER_FULFILLED,
  UPDATE_CONTAINER_REJECTED,
  DELETE_CONTAINER_REQUEST,
  DELETE_CONTAINER_FULFILLED,
  DELETE_CONTAINER_REJECTED,
  UNLOAD_CONTAINER,
  SELECTED_PROVIDER,
} from '../actionTypes';
import containerModel from '../models/container';
import providerModel from '../../Providers/models/provider';

const initialState = {
  providers: [],
  volumes: [],
  secrets: [],
  inheritedEnv: [],
  container: containerModel.get(),
  selectedProvider: {
    isSelected: false,
    supportsEvents: false,
    supportsHealth: false,
    supportsSecrets: false,
    supportsOther: false,
    networks: [],
    type: null,
    provider: providerModel.get(),
  },
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_CONTAINERCREATE_FULFILLED:
      return {
        ...state,
        providers: action.payload.providers,
        volumes: action.payload.volumes,
        secrets: action.payload.secrets,
        inheritedEnv: action.payload.inheritedEnv,
      };
    case INIT_CONTAINEREDIT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case INIT_CONTAINEREDIT_FULFILLED:
      return {
        ...state,
        volumes: action.payload.volumes,
        secrets: action.payload.secrets,
        container: containerModel.get(action.payload.container),
        pending: false,
        completed: true,
      };
    case INIT_CONTAINEREDIT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    // These are for ppolling and updating the state
    case FETCH_CONTAINER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_CONTAINER_FULFILLED:
      return {
        ...state,
        container: containerModel.get(action.payload),
        pending: false,
        completed: true,
      };
    case FETCH_CONTAINER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case CREATE_CONTAINER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case CREATE_CONTAINER_FULFILLED:
      return {
        ...state,
        container: containerModel.get(action.payload),
        pending: false,
        completed: true,
      };
    case CREATE_CONTAINER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case UPDATE_CONTAINER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_CONTAINER_FULFILLED:
      return {
        ...state,
        container: containerModel.get(action.payload),
        pending: false,
        completed: true,
      };
    case UPDATE_CONTAINER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_CONTAINER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DELETE_CONTAINER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case DELETE_CONTAINER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case SELECTED_PROVIDER:
      return {
        ...state,
        selectedProvider: {
          type: action.providerType,
          isSelected: !!action.provider.id,
          supportsHealth: action.supportsHealth,
          supportsSecrets: action.supportsSecrets,
          supportsEvents: action.supportsEvents,
          supportsOther: action.supportsOther,
          networks: action.networks,
          provider: action.provider,
        },
      };
    case UNLOAD_CONTAINER:
      return initialState;
    default:
      return state;
  }
};
