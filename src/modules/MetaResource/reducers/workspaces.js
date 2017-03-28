import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  workspaces: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UNLOAD_WORKSPACES:
      return initialState;
    case types.FETCH_WORKSPACES_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_WORKSPACES_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        workspaces: action.payload,
      };
    case types.FETCH_WORKSPACES_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

