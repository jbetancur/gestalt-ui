import {
  CHANGE_EDITOR_THEME,
} from './actionTypes';

export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete Lambdas',
        multipleItems,
        onProceed: action,
      }
    });
  };
}

export function handleTheme(theme) {
  localStorage.setItem('gf-editor-theme', theme);
  return { type: CHANGE_EDITOR_THEME, theme };
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

export default {
  confirmDelete,
  handleTheme,
  showEntitlementsModal,
  showAPIEndpointWizardModal,
};
