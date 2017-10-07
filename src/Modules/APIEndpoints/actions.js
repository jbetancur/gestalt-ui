export function confirmDelete(action, multipleItems) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: 'Confirm Delete API Endpoints',
      multipleItems,
      onProceed: action,
    }
  };
}

export default {
  confirmDelete,
};
