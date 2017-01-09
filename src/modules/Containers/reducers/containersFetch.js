import {
  FETCH_CONTAINERS_PENDING,
  FETCH_CONTAINERS_REJECTED,
  FETCH_CONTAINERS_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONTAINERS_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_CONTAINERS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        items: action.payload
      };
    case FETCH_CONTAINERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};

