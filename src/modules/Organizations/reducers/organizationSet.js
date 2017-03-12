import {
  FETCH_ORGSET_PENDING,
  FETCH_ORGSET_FULFILLED,
  FETCH_ORGSET_REJECTED,
  ORGSET_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  organizations: [],
  organization: {
    created: {},
    modified: {},
    owner: {},
    properties: {
      env: {}
    }
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ORGSET_UNLOADED:
      return initialState;
    case FETCH_ORGSET_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_ORGSET_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organization: action.payload.item,
        organizations: action.payload.items,
      };
    case FETCH_ORGSET_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
