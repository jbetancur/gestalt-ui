import {
  SELECT_RUNTIME,
} from './actionTypes';

/**
 * showAPIEndpointWizardModal
 * @param {*} implementationId - containerId | lamnbdaId
 * @param {*} implementationType - container | lambda
 */
export function showAPIEndpointWizardModal(params, implementationId, implementationType) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'APIEndpointWizardModal',
    modalProps: {
      params,
      implementationId,
      implementationType,
    }
  };
}

export function setRunTime(runtime = {}) {
  return { type: SELECT_RUNTIME, runtime };
}

export default {
  showAPIEndpointWizardModal,
  setRunTime,
};
