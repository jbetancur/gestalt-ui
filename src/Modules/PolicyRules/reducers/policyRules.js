import { removeItemById } from 'util/helpers/lists';
import {
  FETCH_POLICYRULES_REQUEST,
  FETCH_POLICYRULES_FULFILLED,
  FETCH_POLICYRULES_REJECTED,
  DELETE_POLICYRULE_REQUEST,
  DELETE_POLICYRULE_FULFILLED,
  DELETE_POLICYRULE_REJECTED,
  DELETE_POLICYRULES_REQUEST, // bulk delete
  DELETE_POLICYRULES_FULFILLED,
  DELETE_POLICYRULES_REJECTED,
  UNLOAD_POLICYRULES,
} from '../actionTypes';

const initialState = {
  policyRules: [],
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POLICYRULES_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_POLICYRULES_FULFILLED:
      return {
        ...state,
        policyRules: action.payload,
        pending: false,
        completed: true,
      };
    case FETCH_POLICYRULES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_POLICYRULES_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DELETE_POLICYRULES_FULFILLED:
      return {
        ...state,
        policyRules: state.policyRules.filter(item => action.payload.find(i => i.id === item.id) !== item),
        pending: false,
        completed: true,
      };
    case DELETE_POLICYRULES_REJECTED:
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
        policyRules: removeItemById(state.policyRules, action.payload.id),
        pending: false,
        completed: true,
      };
    case DELETE_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UNLOAD_POLICYRULES:
      return initialState;
    default:
      return state;
  }
};
