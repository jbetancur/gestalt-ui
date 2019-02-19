import {
  INIT_PROVIDEREDIT_REQUEST,
  INIT_PROVIDERCREATE_FULFILLED,
  INIT_PROVIDEREDIT_FULFILLED,
  INIT_PROVIDEREDIT_REJECTED,
  FETCH_PROVIDER_REQUEST,
  FETCH_PROVIDER_FULFILLED,
  FETCH_PROVIDER_REJECTED,
  CREATE_PROVIDER_REQUEST,
  CREATE_PROVIDER_FULFILLED,
  CREATE_PROVIDER_REJECTED,
  UPDATE_PROVIDER_REQUEST,
  UPDATE_PROVIDER_FULFILLED,
  UPDATE_PROVIDER_REJECTED,
  DELETE_PROVIDER_REQUEST,
  DELETE_PROVIDER_FULFILLED,
  DELETE_PROVIDER_REJECTED,
  UNLOAD_PROVIDER,
  SELECTED_PROVIDERTYPE_REQUEST,
  SELECTED_PROVIDERTYPE_FULFILLED,
  SELECTED_PROVIDERTYPE_REJECTED,
  FETCH_PROVIDERCONTAINER_FULFILLED,
  FETCH_PROVIDERCONTAINER_REJECTED,
  TOGGLE_HAS_CONTAINER,
} from '../actionTypes';
import providerModel from '../models/provider';
import envSchemaModel from '../models/envSchema';
import resourceTypeModel from '../../ResourceTypes/models/resourceType';
import containerModel from '../../Containers/models/container';

const initialState = {
  providers: [],
  resourceTypes: [],
  provider: providerModel.get(),
  selectedProviderType: resourceTypeModel.get(),
  hasContainer: false,
  container: containerModel.get(),
  containerError: null,
  envSchema: envSchemaModel.get(),
  envSchemaPending: false,
  envSchemaError: null,
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_PROVIDERCREATE_FULFILLED:
      return {
        ...state,
        providers: action.payload.providers,
        resourceTypes: action.payload.resourceTypes,
      };
    case INIT_PROVIDEREDIT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case INIT_PROVIDEREDIT_FULFILLED:
      return {
        ...state,
        resourceTypes: action.payload.resourceTypes,
        providers: action.payload.providers,
        selectedProviderType: action.payload.selectedProviderType,
        provider: providerModel.get(action.payload.provider),
        hasContainer: action.payload.hasContainer,
        pending: false,
        completed: true,
      };
    case INIT_PROVIDEREDIT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    // These are for ppolling and updating the state
    case FETCH_PROVIDER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_PROVIDER_FULFILLED:
      return {
        ...state,
        provider: providerModel.get(action.payload),
        pending: false,
        completed: true,
      };
    case FETCH_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case CREATE_PROVIDER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case CREATE_PROVIDER_FULFILLED:
      return {
        ...state,
        provider: providerModel.get(action.payload),
        pending: false,
        completed: true,
      };
    case CREATE_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case UPDATE_PROVIDER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_PROVIDER_FULFILLED:
      return {
        ...state,
        provider: providerModel.get(action.payload),
        pending: false,
        completed: true,
      };
    case UPDATE_PROVIDER_REJECTED:
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
        pending: false,
        completed: true,
      };
    case DELETE_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case SELECTED_PROVIDERTYPE_REQUEST:
      return {
        ...state,
        envSchemaPending: true,
      };
    case SELECTED_PROVIDERTYPE_FULFILLED:
      return {
        ...state,
        selectedProviderType: action.payload.selectedProviderType,
        envSchema: action.payload.envSchema,
        envSchemaPending: false,
      };
    case SELECTED_PROVIDERTYPE_REJECTED:
      return {
        ...state,
        envSchemaPending: false,
        envSchemaError: action.payload,
      };

    case FETCH_PROVIDERCONTAINER_FULFILLED:
      return {
        ...state,
        container: containerModel.get(action.payload),
      };
    case FETCH_PROVIDERCONTAINER_REJECTED:
      return {
        ...state,
        containerError: action.payload,
      };
    case TOGGLE_HAS_CONTAINER:
      return {
        ...state,
        hasContainer: action.checkState || !state.hasContainer,
      };
    case UNLOAD_PROVIDER:
      return initialState;
    default:
      return state;
  }
};
