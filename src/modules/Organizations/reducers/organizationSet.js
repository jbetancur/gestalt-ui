import * as metaTypes from 'modules/MetaResource/actionTypes';
import {
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
    case metaTypes.FETCH_ORGSET_PENDING:
      return {
        ...state,
        pending: true
      };
    case metaTypes.FETCH_ORGSET_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organization: action.payload.organization,
        organizations: action.payload.organizations,
      };
    case metaTypes.FETCH_ORGSET_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
