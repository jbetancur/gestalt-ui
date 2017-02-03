import {
    UPDATE_PROVIDER_PENDING,
    UPDATE_PROVIDER_FULFILLED,
    UPDATE_PROVIDER_REJECTED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  item: {
    created: {},
    modified: {},
    properties: {}
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
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
        item: action.payload,
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
