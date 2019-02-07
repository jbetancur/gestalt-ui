import { removeItemById } from 'util/helpers/lists';
import {
  FETCH_POLICIES_REQUEST,
  FETCH_POLICIES_FULFILLED,
  FETCH_POLICIES_REJECTED,
  DELETE_POLICY_REQUEST,
  DELETE_POLICY_FULFILLED,
  DELETE_POLICY_REJECTED,
  DELETE_POLICIES_REQUEST, // bulk delete
  DELETE_POLICIES_FULFILLED,
  DELETE_POLICIES_REJECTED,
  UNLOAD_POLICIES,
} from '../actionTypes';

const initialState = {
  policies: [],
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POLICIES_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_POLICIES_FULFILLED:
      return {
        ...state,
        policies: action.payload,
        pending: false,
        completed: true,
      };
    case FETCH_POLICIES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_POLICIES_REQUEST:
      return {
        ...state,
        pending: true,
      };

    case DELETE_POLICIES_FULFILLED:
      return {
        ...state,
        policies: state.policies.filter(item => action.payload.find(i => i.id === item.id) !== item),
        pending: false,
        completed: true,
      };
    case DELETE_POLICIES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_POLICY_REQUEST:
      return {
        ...state,
        pending: true,
      };

    case DELETE_POLICY_FULFILLED:
      return {
        ...state,
        policies: removeItemById(state.policies, action.payload.id),
        pending: false,
        completed: true,
      };
    case DELETE_POLICY_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case UNLOAD_POLICIES:
      return initialState;
    default:
      return state;
  }
};
