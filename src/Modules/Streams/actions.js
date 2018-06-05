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

export default {
  showModal,
};
