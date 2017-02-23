import {
    UPDATE_API_PENDING,
    UPDATE_API_FULFILLED,
    UPDATE_API_REJECTED,
    API_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  api: {
    created: {},
    modified: {},
    properties: {}
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case API_UNLOADED:
      return initialState;
    case UPDATE_API_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_API_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        api: action.payload,
      };
    case UPDATE_API_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
