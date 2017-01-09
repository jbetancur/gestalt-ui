import {
  FETCH_GROUPS_PENDING,
  FETCH_GROUPS_REJECTED,
  FETCH_GROUPS_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GROUPS_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_GROUPS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        items: action.payload
      };
    case FETCH_GROUPS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};

