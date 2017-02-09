import {
  FETCH_ALLORGS_PENDING,
  FETCH_ALLORGS_REJECTED,
  FETCH_ALLORGS_FULFILLED,
  USER_UNLOADED,
} from '../actionTypes';

const initialState = {
  pendingOrgs: false,
  completed: false,
  organizations: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_UNLOADED:
      return initialState;
    case FETCH_ALLORGS_PENDING:
      return {
        ...state,
        pendingOrgs: true
      };
    case FETCH_ALLORGS_FULFILLED:
      return {
        ...state,
        pendingOrgs: false,
        completed: true,
        organizations: action.payload
      };
    case FETCH_ALLORGS_REJECTED:
      return {
        ...state,
        pendingOrgs: false,
        error: action.payload
      };
    default:
      return state;
  }
};

