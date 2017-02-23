import {
    FETCH_API_PENDING,
    FETCH_API_REJECTED,
    FETCH_API_FULFILLED,
    CREATE_API_PENDING,
    CREATE_API_FULFILLED,
    CREATE_API_REJECTED,
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
    case FETCH_API_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_API_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        api: action.payload
      };
    case FETCH_API_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CREATE_API_PENDING:
      return {
        ...state,
        pending: true,
      };
    case CREATE_API_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        api: action.payload,
      };
    case CREATE_API_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
