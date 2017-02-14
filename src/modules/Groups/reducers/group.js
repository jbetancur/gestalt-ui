import {
    FETCH_GROUP_PENDING,
    FETCH_GROUP_REJECTED,
    FETCH_GROUP_FULFILLED,
    CREATE_GROUP_PENDING,
    CREATE_GROUP_FULFILLED,
    CREATE_GROUP_REJECTED,
    GROUP_UNLOADED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  group: {
    created: {},
    modified: {},
    properties: {
      users: []
    }
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GROUP_UNLOADED:
      return initialState;
    case FETCH_GROUP_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_GROUP_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        group: action.payload
      };
    case FETCH_GROUP_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CREATE_GROUP_PENDING:
      return {
        ...state,
        pending: true,
      };
    case CREATE_GROUP_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        group: action.payload,
      };
    case CREATE_GROUP_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
