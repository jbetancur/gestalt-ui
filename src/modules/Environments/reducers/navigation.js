import {
  ENVIRONMENTS_NAVIGATION
} from '../actionTypes';

const initialState = {
  view: '',
  index: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ENVIRONMENTS_NAVIGATION:
      return {
        ...state,
        view: action.payload.view,
        index: action.payload.index
      };
    default:
      return state;
  }
};
