export function confirmContainerDelete(action, item) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: `Are you sure you want to destroy ${item}?`,
      onProceed: action,
      proceedLabel: 'Destroy',
    }
  };
}

export function scaleContainerModal(action, item, numInstances) {
  return {
    type: 'SHOW_CONTAINER_MODAL',
    modalType: 'SCALE',
    modalProps: {
      title: item,
      numInstances,
      onProceed: action,
    }
  };
}

export function migrateContainerModal(action, item, sourceProvider) {
  return {
    type: 'SHOW_CONTAINER_MODAL',
    modalType: 'MIGRATE',
    modalProps: {
      title: item,
      sourceProvider,
      onProceed: action,
    }
  };
}

export function promoteContainerModal(action, item) {
  return {
    type: 'SHOW_CONTAINER_MODAL',
    modalType: 'PROMOTE',
    modalProps: {
      title: item,
      onProceed: action,
    }
  };
}

export function showEntitlementsModal(item, params) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'EntitlementModal',
    modalProps: {
      title: `Entitlements for "${item}"`,
      params,
    }
  };
}


export default {
  confirmContainerDelete,
  scaleContainerModal,
  migrateContainerModal,
  promoteContainerModal,
  showEntitlementsModal,
};
