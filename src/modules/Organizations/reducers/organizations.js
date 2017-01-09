import {
  FETCH_ORGS_PENDING,
  FETCH_ORGS_REJECTED,
  FETCH_ORGS_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORGS_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_ORGS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        items: action.payload,
      };
    case FETCH_ORGS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
