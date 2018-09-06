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

export function confirmUpdate(action, item, onClose) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: `"${item}" provider container will be re-deployed. Are you sure you want to proceed?`,
      onProceed: action,
      proceedLabel: 'Redeploy',
      forceOption: false,
      onClose,
    }
  };
}

export function showProviderInstanceModal() {
  return {
    type: 'SHOW_MODAL',
    modalType: 'ProviderInstanceModal',
    modalProps: {
      title: 'Create Provider Instance',
    }
  };
}


export default {
  confirmDelete,
  confirmUpdate,
  showProviderInstanceModal,
};
