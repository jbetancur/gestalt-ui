import * as metaTypes from 'modules/MetaResource/actionTypes';
import {
  UNLOAD_ALLORGS,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  error: null,
  organizations: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_ALLORGS:
      return initialState;
    case metaTypes.FETCH_ALLORGS_PENDING:
      return {
        ...state,
        pending: true,
        organizations: []
      };
    case metaTypes.FETCH_ALLORGS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organizations: action.payload
      };
    case metaTypes.FETCH_ALLORGS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
