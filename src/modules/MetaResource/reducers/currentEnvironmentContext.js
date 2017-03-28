import * as types from '../actionTypes';

const initialState = {
  environment: {
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
    case types.UNLOAD_CURRENT_ENVIRONMENT_CONTEXT:
      return initialState;
    case types.UPDATE_CURRENT_ENVIRONMENT_CONTEXT:
      return {
        ...state,
        environment: action.payload,
      };
    default:
      return state;
  }
};
