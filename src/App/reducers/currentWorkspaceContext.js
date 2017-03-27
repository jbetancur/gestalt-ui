import * as metaTypes from 'modules/MetaResource/actionTypes';
import {
  UNLOAD_CURRENT_WORKSPACE_CONTEXT,
} from '../actionTypes';

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
    case UNLOAD_CURRENT_WORKSPACE_CONTEXT:
      return initialState;
    case metaTypes.UPDATE_CURRENT_WORKSPACE_CONTEXT:
      return {
        ...state,
        workspace: action.payload,
      };
    default:
      return state;
  }
};
