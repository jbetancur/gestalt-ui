import * as metaTypes from 'modules/MetaResource/actionTypes';
import {
  UNLOAD_CURRENT_ENVIRONMENT_CONTEXT,
} from '../actionTypes';

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
    case UNLOAD_CURRENT_ENVIRONMENT_CONTEXT:
      return initialState;
    case metaTypes.UPDATE_CURRENT_ENVIRONMENT_CONTEXT:
      return {
        ...state,
        environment: action.payload,
      };
    default:
      return state;
  }
};
