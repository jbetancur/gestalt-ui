import {
  FETCH_POLICY_REQUEST,
  FETCH_POLICY_FULFILLED,
  FETCH_POLICY_REJECTED,
  CREATE_POLICY_REQUEST,
  CREATE_POLICY_FULFILLED,
  CREATE_POLICY_REJECTED,
  UPDATE_POLICY_REQUEST,
  UPDATE_POLICY_FULFILLED,
  UPDATE_POLICY_REJECTED,
  UNLOAD_POLICY,
} from '../actionTypes';
import policyModel from '../models/policy';

const initialState = {
  policy: policyModel.get(),
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POLICY_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_POLICY_FULFILLED:
      return {
        ...state,
        policy: action.payload,
        pending: false,
        completed: true,
      };
    case FETCH_POLICY_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case CREATE_POLICY_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case CREATE_POLICY_FULFILLED:
      return {
        ...state,
        policy: action.payload,
        pending: false,
        completed: true,
      };
    case CREATE_POLICY_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case UPDATE_POLICY_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_POLICY_FULFILLED:
      return {
        ...state,
        policy: action.payload,
        pending: false,
        completed: true,
      };
    case UPDATE_POLICY_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case UNLOAD_POLICY:
      return initialState;
    default:
      return state;
  }
};
