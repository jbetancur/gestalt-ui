import {
  FETCH_LICENSE_PENDING,
  FETCH_LICENSE_FULFILLED,
  FETCH_LICENSE_REJECTED,
  LICENSE_UNLOADED,
  UPDATE_LICENSE_PENDING,
  UPDATE_LICENSE_FULFILLED,
  UPDATE_LICENSE_REJECTED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  license: {
    features: {}
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LICENSE_UNLOADED:
      return initialState;
    case FETCH_LICENSE_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_LICENSE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        license: action.payload
      };
    case FETCH_LICENSE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UPDATE_LICENSE_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_LICENSE_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case UPDATE_LICENSE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
