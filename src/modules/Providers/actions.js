export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete Providers',
        multipleItems,
        onProceed: action,
      }
    });
  };
}

export function confirmUpdate(action, item) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: `Updating "${item}" provider will require a restart. Are you sure you want to proceed?`,
        onProceed: action,
        proceedLabel: 'Update',
      }
    });
  };
}

export default {
  confirmDelete,
  confirmUpdate,
};
