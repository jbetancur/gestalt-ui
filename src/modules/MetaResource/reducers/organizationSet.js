import * as types from '../actionTypes';

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
    case types.UNLOAD_ORGSET:
      return initialState;
    case types.FETCH_ORGSET_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.FETCH_ORGSET_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organization: action.payload.organization,
        organizations: action.payload.organizations,
      };
    case types.FETCH_ORGSET_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
