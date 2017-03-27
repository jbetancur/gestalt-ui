import * as metaTypes from 'modules/MetaResource/actionTypes';
import {
  WORKSPACES_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  workspaces: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case WORKSPACES_UNLOADED:
      return initialState;
    case metaTypes.FETCH_WORKSPACES_PENDING:
      return {
        ...state,
        pending: true,
      };
    case metaTypes.FETCH_WORKSPACES_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        workspaces: action.payload,
      };
    case metaTypes.FETCH_WORKSPACES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

