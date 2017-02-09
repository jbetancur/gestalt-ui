import {
  FETCH_ALLORGS_PENDING,
  FETCH_ALLORGS_FULFILLED,
  FETCH_ALLORGS_REJECTED,
  UNLOAD_ALLORGS,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  error: null,
  organizations: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_ALLORGS:
      return initialState;
    case FETCH_ALLORGS_PENDING:
      return {
        ...state,
        pending: true,
        organizations: []
      };
    case FETCH_ALLORGS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organizations: action.payload
      };
    case FETCH_ALLORGS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
