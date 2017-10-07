import {
  SHOW_HEALTH_CHECK_MODAL,
  HIDE_HEALTH_CHECK_MODAL,
  ADD_HEALTH_CHECK,
  REMOVE_HEALTH_CHECK,
  HEALTH_CHECKS_UNLOADED,
} from './actionTypes';

export function showHealthCheckModal(action) {
  return (dispatch) => {
    dispatch({
      type: SHOW_HEALTH_CHECK_MODAL,
      modalProps: {
        title: 'Create a Health Check',
        onProceed: action,
      }
    });
  };
}

export function hideHealthCheckModal() {
  return { type: HIDE_HEALTH_CHECK_MODAL };
}

export function unloadHealthChecks() {
  return { type: HEALTH_CHECKS_UNLOADED };
}

export function addHealthCheck(healthCheck) {
  return { type: ADD_HEALTH_CHECK, payload: healthCheck };
}

export function removeHealthCheck(healthCheck) {
  return { type: REMOVE_HEALTH_CHECK, payload: healthCheck };
}

export default {
  showHealthCheckModal,
  hideHealthCheckModal,
  unloadHealthChecks,
  addHealthCheck,
  removeHealthCheck
};
