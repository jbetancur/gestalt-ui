import {
    FETCH_POLICYRULE_PENDING,
    FETCH_POLICYRULE_REJECTED,
    FETCH_POLICYRULE_FULFILLED,
    CREATE_POLICYRULE_PENDING,
    CREATE_POLICYRULE_FULFILLED,
    CREATE_POLICYRULE_REJECTED,
    DELETE_POLICYRULE_PENDING,
    DELETE_POLICYRULE_FULFILLED,
    DELETE_POLICYRULE_REJECTED,
    POLICYRULE_UNLOADED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  policyRule: {
    created: {},
    modified: {},
    properties: {
      actions: [],
      eval_logic: {}
    }
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POLICYRULE_UNLOADED:
      return initialState;
    case FETCH_POLICYRULE_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_POLICYRULE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        policyRule: action.payload
      };
    case FETCH_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CREATE_POLICYRULE_PENDING:
      return {
        ...state,
        pending: true,
      };
    case CREATE_POLICYRULE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        policyRule: action.payload,
      };
    case CREATE_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
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
