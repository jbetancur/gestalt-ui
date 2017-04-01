import { toggleHandler } from 'util/helpers/lists';
import {
  SELECTED_POLICYRULES,
  SELECTED_ACTIONS,
  // FETCH_LAMBDAS_REQUEST,
  // FETCH_LAMBDAS_FULFILLED,
  // FETCH_LAMBDAS_REJECTED,
} from './actionTypes';

export function handleSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: SELECTED_POLICYRULES, payload };
}

export function clearSelected() {
  const payload = {
    selectedCount: 0,
    showTitle: true,
    selectedItems: []
  };

  return { type: SELECTED_POLICYRULES, payload };
}

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
