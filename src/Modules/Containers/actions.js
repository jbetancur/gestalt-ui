export function confirmContainerDelete(action, item, cancelAction = () => { }) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: `Are you sure you want to destroy ${item}?`,
      onProceed: action,
      onClose: cancelAction,
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

export function migrateContainerModal(action, item, sourceProvider, inContainerView) {
  return {
    type: 'SHOW_CONTAINER_MODAL',
    modalType: 'MIGRATE',
    modalProps: {
      title: item,
      sourceProvider,
      inContainerView,
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

/**
 * showAPIEndpointWizardModal
 * @param {String} implementationId - containerId | lamnbdaId
 * @param {String} implementationType - container | lambda
 * @param {Array} portMappings - only required if implementationType = container
 */
export function showAPIEndpointWizardModal(params, implementationId, implementationType, portMappings = []) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'APIEndpointWizardModal',
    modalProps: {
      params,
      implementationId,
      implementationType,
      portMappings,
    }
  };
}

/**
 * showImportModal
 * @param {Object} props
 */
export function showImportModal(props = {}) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'ContainerImportModal',
    modalProps: {
      title: 'Import Container',
      ...props,
    },
  };
}

export default {
  confirmContainerDelete,
  scaleContainerModal,
  migrateContainerModal,
  promoteContainerModal,
  showAPIEndpointWizardModal,
  showImportModal,
};
