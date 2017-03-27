import {
  ORG_UNLOADED,
  ORGSET_UNLOADED,
} from './actionTypes';

export function onUnload() {
  return { type: ORG_UNLOADED };
}

export function onUnloadSet() {
  return { type: ORGSET_UNLOADED };
}

export function confirmDelete(action, item) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: `Are you sure you want to delete the ${item} Organization?`,
      body: `All items within ${item} will be deleted. This action cannot be undone.`,
      onProceed: action,
    }
  };
}
