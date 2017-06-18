import {
  TOGGLE_RATE_LIMIT,
  UNLOAD_RATE_LIMIT
} from '../actionTypes';

const initialState = {
  toggled: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_RATE_LIMIT:
      return initialState;
    case TOGGLE_RATE_LIMIT:
      return {
        ...state,
        toggled: action.toggled,
      };
    default:
      return state;
  }
};

