/**
 * showStreamMetricsModal
 * @param {Object} props
 */
export function showModal(props = {}) {
  return {
    type: 'SHOW_MODAL',
    title: 'Stream',
    modalType: 'StreamInstanceModal',
    modalProps: props,
  };
}

export function confirmDelete(action, title, multipleItems) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title,
      multipleItems,
      onProceed: action,
    }
  };
}

export default {
  showModal,
  confirmDelete,
};
