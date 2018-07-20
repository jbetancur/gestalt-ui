export function showReparentModal(action, title, multipleItems) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'REPARENTUSER',
    modalProps: {
      title,
      multipleItems,
      onProceed: action,
    }
  };
}

export default {
  showReparentModal,
};
