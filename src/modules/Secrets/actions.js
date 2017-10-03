import {
  SHOW_SECRET_MODAL,
  HIDE_SECRET_MODAL,
  ADD_SECRET,
  REMOVE_SECRET,
  SECRETS_UNLOADED,
} from './actionTypes';

export function confirmDelete(action, multipleItems) {
  return ({
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: 'Confirm Delete Secrets',
      multipleItems,
      onProceed: action,
    }
  });
}

export function showSecretModal(action) {
  return ({
    type: SHOW_SECRET_MODAL,
    modalProps: {
      title: 'Create a Secret',
      onProceed: action,
    }
  });
}

export function hideSecretModal() {
  return { type: HIDE_SECRET_MODAL };
}

export function unloadSecretsModal() {
  return { type: SECRETS_UNLOADED };
}

export function addSecret(secret) {
  return { type: ADD_SECRET, payload: secret };
}

export function removeSecret(secret) {
  return { type: REMOVE_SECRET, payload: secret };
}

export default {
  confirmDelete,
  showSecretModal,
  hideSecretModal,
  unloadSecretsModal,
  addSecret,
  removeSecret,
};
