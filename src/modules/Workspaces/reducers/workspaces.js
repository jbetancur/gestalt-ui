import {
  FETCH_WORKSPACES_PENDING,
  FETCH_WORKSPACES_REJECTED,
  FETCH_WORKSPACES_FULFILLED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WORKSPACES_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_WORKSPACES_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        items: action.payload,
      };
    case FETCH_WORKSPACES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

