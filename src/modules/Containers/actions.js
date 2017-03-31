export function confirmDelete(action, item) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: `Are you sure you want to destroy ${item}?`,
        onProceed: action,
        proceedLabel: 'Destroy',
      }
    });
  };
}

export function scaleContainerModal(action, item, numInstances) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_CONTAINER_MODAL',
      modalType: 'SCALE',
      modalProps: {
        title: item,
        numInstances,
        onProceed: action,
      }
    });
  };
}

export function migrateContainerModal(action, item, provider, fetchProvidersCb, params) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_CONTAINER_MODAL',
      modalType: 'MIGRATE',
      modalProps: {
        title: item,
        provider,
        fetchProviders: fetchProvidersCb,
        params,
        onProceed: action,
      }
    });
  };
}

export default {
  confirmDelete,
  scaleContainerModal,
  migrateContainerModal,
};
