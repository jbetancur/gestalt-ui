import * as types from '../actionTypes';

/**
 * fetchEnvironments
 * @param {string} fqon
 * @param {string} workspaceId
 */
export function fetchEnvironments(fqon, workspaceId) {
  return { type: types.FETCH_ENVIRONMENTS_REQUEST, fqon, workspaceId };
}

/**
 * fetchEnvironment
 * @param {string} fqon
 * @param {string} environmentId
 */
export function fetchEnvironment(fqon, environmentId) {
  return { type: types.FETCH_ENVIRONMENT_REQUEST, fqon, environmentId };
}

/**
 * createEnvironment
 * @param {string} fqon
 * @param {string} workspaceId
 * @param {Object} payload
 * @callback {*} onSuccess
 */
export function createEnvironment(fqon, workspaceId, payload, onSuccess) {
  return { type: types.CREATE_ENVIRONMENT_REQUEST, fqon, workspaceId, payload, onSuccess };
}

/**
 * updateEnvironment
 * @param {string} fqon
 * @param {string} environmentId
 * @param {Array} payload
 * @callback {*} onSuccess
 */
export function updateEnvironment(fqon, environmentId, payload, onSuccess) {
  return { type: types.UPDATE_ENVIRONMENT_REQUEST, fqon, environmentId, payload, onSuccess };
}

/**
 * deleteEnvironment
 * @param {string} fqon
 * @param {string} environmentId
 * @callback {*} onSuccess
 */
export function deleteEnvironment(fqon, environmentId, onSuccess) {
  return { type: types.DELETE_ENVIRONMENT_REQUEST, fqon, environmentId, onSuccess };
}

export default {
  fetchEnvironments,
  fetchEnvironment,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
};
