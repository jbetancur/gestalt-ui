import {
  CURRENT_ORG_CONTEXT,
} from '../actionTypes';

const initialState = {
  organization: {
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
    case CURRENT_ORG_CONTEXT:
      return {
        ...state,
        organization: action.payload,
      };
    default:
      return state;
  }
};
