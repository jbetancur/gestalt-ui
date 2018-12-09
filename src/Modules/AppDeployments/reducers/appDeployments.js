import { removeItemById } from 'util/helpers/lists';
import {
  INIT_APPDEPLOYMENTCREATE_REQUEST,
  INIT_APPDEPLOYMENTCREATE_FULFILLED,
  FETCH_APPDEPLOYMENTS_REQUEST,
  FETCH_APPDEPLOYMENTS_FULFILLED,
  FETCH_APPDEPLOYMENTS_REJECTED,
  DELETE_APPDEPLOYMENT_REQUEST,
  DELETE_APPDEPLOYMENT_FULFILLED,
  DELETE_APPDEPLOYMENT_REJECTED,
  DELETE_APPDEPLOYMENTS_REQUEST, // bulk delete
  UNLOAD_APPDEPLOYMENTS,
} from '../constants';

const initialState = {
  appDeployments: [],
  providers: [],
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_APPDEPLOYMENTCREATE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case INIT_APPDEPLOYMENTCREATE_FULFILLED:
      return {
        ...state,
        providers: action.payload.providers,
      };

    case FETCH_APPDEPLOYMENTS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_APPDEPLOYMENTS_FULFILLED:
      return {
        ...state,
        appDeployments: action.payload,
        pending: false,
        completed: true,
      };
    case FETCH_APPDEPLOYMENTS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_APPDEPLOYMENTS_REQUEST:
      return {
        ...state,
        pending: true,
      };

    case DELETE_APPDEPLOYMENT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DELETE_APPDEPLOYMENT_FULFILLED:
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          appDeployments: state.appDeployments.filter(item => action.payload.find(i => i.id === item.id) !== item),
          pending: false,
          completed: true,
        };
      }
      return {
        ...state,
        appDeployments: removeItemById(state.appDeployments, action.payload.id),
        pending: false,
        completed: true,
      };
    case DELETE_APPDEPLOYMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UNLOAD_APPDEPLOYMENTS:
      return initialState;
    default:
      return state;
  }
};
