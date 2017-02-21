import {
  FETCH_ORG_PENDING,
  FETCH_ORG_REJECTED,
  FETCH_ORG_FULFILLED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  organization: {
    org: {},
    created: {},
    modified: {},
    properties: {
      env: {}
    }
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORG_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_ORG_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organization: action.payload,
      };
    case FETCH_ORG_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
