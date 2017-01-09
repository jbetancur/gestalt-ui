import {
  FETCH_ALLORGS_PENDING,
  FETCH_ALLORGS_FULFILLED,
  FETCH_ALLORGS_REJECTED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  error: null,
  items: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALLORGS_PENDING:
      return {
        ...state,
        pending: true,
        items: []
      };
    case FETCH_ALLORGS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        items: action.payload
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
