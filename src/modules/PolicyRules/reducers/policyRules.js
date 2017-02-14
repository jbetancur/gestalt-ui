import {
  FETCH_POLICYRULES_PENDING,
  FETCH_POLICYRULES_REJECTED,
  FETCH_POLICYRULES_FULFILLED,
  POLICYRULES_UNLOADED,
  DELETE_POLICYRULE_PENDING,
  DELETE_POLICYRULE_FULFILLED,
  DELETE_POLICYRULE_REJECTED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  policyRules: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POLICYRULES_UNLOADED:
      return initialState;
    case FETCH_POLICYRULES_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_POLICYRULES_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        policyRules: action.payload
      };
    case FETCH_POLICYRULES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case DELETE_POLICYRULE_PENDING:
      return {
        ...state,
        pending: true,
      };
    case DELETE_POLICYRULE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case DELETE_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

