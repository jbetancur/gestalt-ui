import * as metaTypes from 'modules/MetaResource/actionTypes';

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
    case metaTypes.UPDATE_CURRENT_ORG_CONTEXT:
      return {
        ...state,
        organization: action.payload,
      };
    default:
      return state;
  }
};
