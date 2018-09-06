
import { getLastFromSplit } from 'util/helpers/strings';
import {
  SELECTED_PROVIDER,
  UNLOAD_SELECTED_PROVIDER,
} from './constants';

export function setSelectedProvider(provider = {}) {
  return {
    type: SELECTED_PROVIDER,
    providerType: getLastFromSplit(provider.resource_type),
    provider,
  };
}

export function clearSelectedProvider() {
  return {
    type: UNLOAD_SELECTED_PROVIDER,
  };
}

export function confirmDelete(action, title, multipleItems) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title,
      multipleItems,
      forceOption: false,
      onProceed: action,
    }
  };
}

export default {
  setSelectedProvider,
  confirmDelete,
};
