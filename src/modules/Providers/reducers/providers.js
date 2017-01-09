import {
  FETCH_PROVIDERS_PENDING,
  FETCH_PROVIDERS_REJECTED,
  FETCH_PROVIDERS_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROVIDERS_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_PROVIDERS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        items: action.payload,
      };
    case FETCH_PROVIDERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

