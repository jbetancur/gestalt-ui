import {
    ADD_GROUP_MEMBER_PENDING,
    ADD_GROUP_MEMBER_FULFILLED,
    ADD_GROUP_MEMBER_REJECTED,
    REMOVE_GROUP_MEMBER_PENDING,
    REMOVE_GROUP_MEMBER_FULFILLED,
    REMOVE_GROUP_MEMBER_REJECTED,
    GROUP_MEMBERS_UNLOADED
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
    case GROUP_MEMBERS_UNLOADED:
      return initialState;
    case ADD_GROUP_MEMBER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case ADD_GROUP_MEMBER_FULFILLED:
      return {
        ...state,
        pending: false,
        group: action.payload,
        completed: true
      };
    case ADD_GROUP_MEMBER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case REMOVE_GROUP_MEMBER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case REMOVE_GROUP_MEMBER_FULFILLED:
      return {
        ...state,
        pending: false,
        group: action.payload,
        completed: true
      };
    case REMOVE_GROUP_MEMBER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
