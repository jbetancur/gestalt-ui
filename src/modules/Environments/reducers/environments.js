import {
  FETCH_ENVIRONMENTS_PENDING,
  FETCH_ENVIRONMENTS_REJECTED,
  FETCH_ENVIRONMENTS_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ENVIRONMENTS_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_ENVIRONMENTS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        items: action.payload,
      };
    case FETCH_ENVIRONMENTS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

