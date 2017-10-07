import {
  CHANGE_EDITOR_THEME
} from '../actionTypes';

const initialState = localStorage.getItem('gf-editor-theme') || 'chrome';

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_EDITOR_THEME:
      return action.theme;
    default:
      return state;
  }
};
