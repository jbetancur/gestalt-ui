import * as types from '../actionTypes';

const initialState = {
  organization: {
    org: {
      properties: {},
    },
    created: {},
    modified: {},
    properties: {
      env: {}
    }
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_CURRENT_ORG_CONTEXT:
      return {
        ...state,
        organization: action.payload,
      };
    default:
      return state;
  }
};
