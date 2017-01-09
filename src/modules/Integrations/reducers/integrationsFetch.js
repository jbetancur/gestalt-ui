import {
  FETCH_INTEGRATIONS_PENDING,
  FETCH_INTEGRATIONS_REJECTED,
  FETCH_INTEGRATIONS_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INTEGRATIONS_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_INTEGRATIONS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        items: action.payload
      };
    case FETCH_INTEGRATIONS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};

