import {
    UPDATE_POLICY_PENDING,
    UPDATE_POLICY_FULFILLED,
    UPDATE_POLICY_REJECTED,
    POLICY_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  policy: {
    created: {},
    modified: {},
    properties: {}
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POLICY_UNLOADED:
      return initialState;
    case UPDATE_POLICY_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_POLICY_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        policy: action.payload,
      };
    case UPDATE_POLICY_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
