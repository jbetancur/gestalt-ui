import { getLastFromSplit } from 'util/helpers/strings';
import {
  SELECTED_PROVIDER,
} from './constants';
import providerModel from '../Providers/models/provider';

export function confirmContainerDelete(action, item, cancelAction = () => { }) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: `Are you sure you want to destroy ${item}?`,
      onProceed: action,
      onClose: cancelAction,
      proceedLabel: 'Destroy',
      forceOption: false,
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

/**
 * setSelectedProvider
 * @param {*} provider
 */
export function setSelectedProvider(provider = {}) {
  const providerType = getLastFromSplit(provider.resource_type);
  const model = providerModel.get(provider);
  const supportsSecrets = () => {
    switch (providerType) {
      case 'Kubernetes':
        return true;
      case 'Docker':
        return false;
      case 'DCOS':
        if (model.properties.config.secret_support) {
          return true;
        }

        return false;
      default:
        return false;
    }
  };

  const networks = providerType === 'Kubernetes'
    ? [{ name: 'default' }]
    : model.properties.config.networks;
  const networksList = networks && networks.length ? networks : [{ name: 'BRIDGE' }];

  return {
    type: SELECTED_PROVIDER,
    supportsSecrets: supportsSecrets(),
    supportsEvents: providerType === 'Kubernetes',
    supportsHealth: providerType !== 'Docker',
    networks: networksList,
    providerType,
    provider: model,
  };
}

export default {
  confirmContainerDelete,
  scaleContainerModal,
  migrateContainerModal,
  promoteContainerModal,
  showAPIEndpointWizardModal,
  showImportModal,
  setSelectedProvider,
};
