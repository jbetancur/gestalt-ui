import * as metaTypes from 'modules/MetaResource/actionTypes';
import {
  ORGS_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  organizations: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ORGS_UNLOADED:
      return initialState;
    case metaTypes.FETCH_ORGS_PENDING:
      return {
        ...state,
        pending: true
      };
    case metaTypes.FETCH_ORGS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organizations: action.payload,
      };
    case metaTypes.FETCH_ORGS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
