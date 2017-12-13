export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete Resource Types',
        multipleItems,
        onProceed: action,
      }
    });
  };
}

export default {
  confirmDelete,
};
