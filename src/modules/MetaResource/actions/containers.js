import * as types from '../actionTypes';

/**
 * fetchContainers
 * @param {string} fqon
 * @param {string} environmentId
 * @param {boolean} isPolling
 */
export function fetchContainers(fqon, environmentId, isPolling) {
  return { type: types.FETCH_CONTAINERS_REQUEST, fqon, environmentId, isPolling };
}

/**
 * fetchContainer
 * @param {string} fqon
 * @param {string} containerId
 * @param {string} environmentId
 * @param {boolean} isPolling
 */
export function fetchContainer(fqon, containerId, environmentId, isPolling) {
  return { type: types.FETCH_CONTAINER_REQUEST, fqon, containerId, environmentId, isPolling };
}

/**
 * createContainer
 * @param {string} fqon
 * @param {string} environmentId
 * @param {*} payload
 * @callback {*} onSuccess
 */
export function createContainer(fqon, environmentId, payload, onSuccess) {
  return { type: types.CREATE_CONTAINER_REQUEST, fqon, environmentId, payload, onSuccess };
}

/**
 * updateContainer
 * @param {string} fqon
 * @param {string} containerId
 * @param {*} payload
 * @callback {*} onSuccess
 */
export function updateContainer(fqon, containerId, payload, onSuccess) {
  return { type: types.UPDATE_CONTAINER_REQUEST, fqon, containerId, payload, onSuccess };
}

/**
 *
 * @param {string} fqon
 * @param {string} containerId
 * @callback {*} onSuccess
 */
export function deleteContainer(fqon, containerId, onSuccess) {
  return { type: types.DELETE_CONTAINER_REQUEST, fqon, containerId, onSuccess };
}

/**
 * deleteContainer
 * @param {string} fqon
 * @param {string} environmentId
 * @param {string} containerId
 * @param {integer} numInstances
 * @callback {*} onSuccess
 */
export function scaleContainer(fqon, environmentId, containerId, numInstances, onSuccess) {
  return { type: types.SCALE_CONTAINER_REQUEST, fqon, environmentId, containerId, numInstances, onSuccess };
}

/**
 * migrateContainer
 * @param {string} fqon
 * @param {string} environmentId
 * @param {string} containerId
 * @param {string} providerId
 * @callback {*} onSuccess
 */
export function migrateContainer(fqon, environmentId, containerId, providerId, onSuccess) {
  return { type: types.MIGRATE_CONTAINER_REQUEST, fqon, environmentId, containerId, providerId, onSuccess };
}

export default {
  fetchContainers,
  fetchContainer,
  createContainer,
  updateContainer,
  deleteContainer,
  scaleContainer,
  migrateContainer,
};
