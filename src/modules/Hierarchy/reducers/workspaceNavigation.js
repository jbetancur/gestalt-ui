import {
  WORKSPACES_NAVIGATION
} from '../actionTypes';

const initialState = {
  view: 'environments',
  index: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case WORKSPACES_NAVIGATION:
      return {
        ...state,
        view: action.payload.view,
        index: action.payload.index,
      };
    default:
      return state;
  }
};
