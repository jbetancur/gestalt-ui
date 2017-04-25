import {
  CHANGE_EDITOR_THEME,
} from './actionTypes';

export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete Lambdas',
        multipleItems,
        onProceed: action,
      }
    });
  };
}

export function handleTheme(theme) {
  localStorage.setItem('gf-editor-theme', theme);
  return { type: CHANGE_EDITOR_THEME, theme };
}
