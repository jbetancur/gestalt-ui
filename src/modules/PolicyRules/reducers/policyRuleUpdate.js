import {
    UPDATE_POLICYRULE_PENDING,
    UPDATE_POLICYRULE_FULFILLED,
    UPDATE_POLICYRULE_REJECTED,
    POLICYRULE_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  policyRule: {
    created: {},
    modified: {},
    properties: {}
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POLICYRULE_UNLOADED:
      return initialState;
    case UPDATE_POLICYRULE_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_POLICYRULE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        policyRule: action.payload,
      };
    case UPDATE_POLICYRULE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
