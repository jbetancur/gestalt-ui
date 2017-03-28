import {
  ENVIRONMENTS_NAVIGATION,
} from './actionTypes';

export function handleNavigation(view, index) {
  const payload = {
    view,
    index
  };

  return { type: ENVIRONMENTS_NAVIGATION, payload };
}

export function confirmDelete(action, item) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: `Are you sure you want to delete the ${item} Environment?`,
        body: `All items within ${item} will be deleted. This action cannot be undone.`,
        onProceed: action,
      }
    });
  };
}
