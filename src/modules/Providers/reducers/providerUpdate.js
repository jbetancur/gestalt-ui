import {
    UPDATE_PROVIDER_PENDING,
    UPDATE_PROVIDER_FULFILLED,
    UPDATE_PROVIDER_REJECTED,
    PROVIDER_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  provider: {
    created: {},
    modified: {},
    properties: {}
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PROVIDER_UNLOADED:
      return initialState;
    case UPDATE_PROVIDER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_PROVIDER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        provider: action.payload,
      };
    case UPDATE_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
