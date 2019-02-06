import { object, array, string } from 'yup';
import {
  FETCH_POLICYRULE_REQUEST,
  FETCH_POLICYRULE_FULFILLED,
  FETCH_POLICYRULE_REJECTED,
  CREATE_POLICYRULE_REQUEST,
  CREATE_POLICYRULE_FULFILLED,
  CREATE_POLICYRULE_REJECTED,
  UPDATE_POLICYRULE_REQUEST,
  UPDATE_POLICYRULE_FULFILLED,
  UPDATE_POLICYRULE_REJECTED,
  DELETE_POLICYRULE_REQUEST,
  DELETE_POLICYRULE_FULFILLED,
  DELETE_POLICYRULE_REJECTED,
  UNLOAD_POLICYRULE,
} from '../actionTypes';

const schema = object().shape({
  id: string(),
  name: string().default(''),
  description: string(),
  resource_type: string().default('Gestalt::Resource::Rule::Event'),
  resource_state: string(),
  created: object().shape({}),
  modified: object().shape({}),
  owner: object().shape({}),
  org: object().shape({
    properties: object().shape({}),
  }),
  properties: object().shape({
    match_actions: array().default([]),
  }),
});

const initialState = {
  policyRule: schema.cast(),
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POLICYRULE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_POLICYRULE_FULFILLED:
      return {
        ...state,
        policyRule: action.payload,
        pending: false,
        completed: true,
      };
    case FETCH_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case CREATE_POLICYRULE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case CREATE_POLICYRULE_FULFILLED:
      return {
        ...state,
        policyRule: action.payload,
        pending: false,
        completed: true,
      };
    case CREATE_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case UPDATE_POLICYRULE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_POLICYRULE_FULFILLED:
      return {
        ...state,
        policyRule: action.payload,
        pending: false,
        completed: true,
      };
    case UPDATE_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_POLICYRULE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DELETE_POLICYRULE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case DELETE_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UNLOAD_POLICYRULE:
      return initialState;
    default:
      return state;
  }
};
