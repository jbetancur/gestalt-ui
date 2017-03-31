import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  environment: {
    created: {},
    modified: {},
    owner: {},
    properties: {
      env: {},
      workspace: {},
    }
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_ENVIRONMENT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_ENVIRONMENT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        environment: action.payload
      };
    case types.FETCH_ENVIRONMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.CREATE_ENVIRONMENT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.CREATE_ENVIRONMENT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        environment: action.payload,
      };
    case types.CREATE_ENVIRONMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.UPDATE_ENVIRONMENT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.UPDATE_ENVIRONMENT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        environment: action.payload,
      };
    case types.UPDATE_ENVIRONMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.DELETE_ENVIRONMENT_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.DELETE_ENVIRONMENT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case types.DELETE_ENVIRONMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
