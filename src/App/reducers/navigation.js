import {
  TOGGLE_NAVIGATION,
} from '../actionTypes';

const initialState = {
  expanded: JSON.parse((localStorage.getItem('gf-pinned-nav'))) || false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_NAVIGATION:
      localStorage.setItem('gf-pinned-nav', !state.expanded);

      return {
        ...state,
        expanded: !state.expanded,
      };
    default:
      return state;
  }
};
