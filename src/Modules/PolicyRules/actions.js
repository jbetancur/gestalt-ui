import {
  SELECTED_ACTIONS,
} from './actionTypes';

export function handleSelectedActions(action, selectedActions) {
  const actions = selectedActions.slice();

  if (action) {
    const index = selectedActions.indexOf(action);
    if (index > -1) {
      actions.splice(index, 1);
    } else {
      actions.push(action);
    }
  }

  return { type: SELECTED_ACTIONS, payload: actions };
}

export function clearSelectedActions() {
  return { type: SELECTED_ACTIONS, payload: [] };
}

export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete Policy Rules',
        multipleItems,
        onProceed: action,
      }
    });
  };
}

export default {
  handleSelectedActions,
  clearSelectedActions,
  confirmDelete,
};
