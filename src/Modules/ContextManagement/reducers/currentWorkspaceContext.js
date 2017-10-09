import * as types from '../actionTypes';

const initialState = {
  workspace: {
    org: {},
    created: {},
    modified: {},
    properties: {
      env: {}
    }
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UNLOAD_CURRENT_WORKSPACE_CONTEXT:
      return initialState;
    case types.UPDATE_CURRENT_WORKSPACE_CONTEXT:
      return {
        ...state,
        workspace: action.payload,
      };
    default:
      return state;
  }
};
