import {
  TOGGLE_RATE_LIMIT,
  UNLOAD_RATE_LIMIT,
} from './actionTypes';

export function unloadRateLimitToggleState() {
  return { type: UNLOAD_RATE_LIMIT };
}

export function toggleRateLimit(toggled) {
  return { type: TOGGLE_RATE_LIMIT, toggled };
}

export function confirmDelete(action, multipleItems) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: 'Confirm Delete API Endpoints',
      multipleItems,
      onProceed: action,
    }
  };
}
