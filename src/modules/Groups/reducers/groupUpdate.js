import {
    UPDATE_GROUP_PENDING,
    UPDATE_GROUP_FULFILLED,
    UPDATE_GROUP_REJECTED,
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
    case UPDATE_GROUP_PENDING:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_GROUP_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        group: action.payload,
      };
    case UPDATE_GROUP_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
