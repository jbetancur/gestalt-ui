import {
  CHANGE_EDITOR_THEME,
  SELECT_RUNTIME,
} from './actionTypes';

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

export function handleTheme(theme) {
  localStorage.setItem('gf-editor-theme', theme);
  return { type: CHANGE_EDITOR_THEME, theme };
}

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
  confirmDelete,
  handleTheme,
  showAPIEndpointWizardModal,
  setRunTime,
};
