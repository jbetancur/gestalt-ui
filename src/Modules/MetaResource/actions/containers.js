import * as types from '../actionTypes';

/**
 * unloadContainers
 */
export function unloadContainers() {
  return { type: types.UNLOAD_CONTAINERS };
}

/**
 * unloadContainer
 */
export function unloadContainer() {
  return { type: types.UNLOAD_CONTAINER };
}

/**
 * fetchContainers
 * @param {string} fqon
  * @param {string} entityId
 * @param {string} entityKey - oneOf provides | environments | null
 * @param {boolean} isPolling
 */
export function fetchContainers(fqon, entityId, entityKey, isPolling) {
  return { type: types.FETCH_CONTAINERS_REQUEST, fqon, entityId, entityKey, isPolling };
}

/**
 * fetchContainersDropDown
 * @param {string} fqon
 * @param {string} environmentId
 */
export function fetchContainersDropDown(fqon, environmentId) {
  return { type: types.FETCH_CONTAINERS_DROPDOWN_REQUEST, fqon, environmentId };
}


/**
 * fetchContainer
 * @param {string} fqon
 * @param {string} containerId
 * @param {string} entityId
 * @param {string} entityKey - oneOf workpsaces | environments | null
 * @param {boolean} isPolling
 */
export function fetchContainer(fqon, containerId, entityId, entityKey, isPolling) {
  return { type: types.FETCH_CONTAINER_REQUEST, fqon, containerId, entityId, entityKey, isPolling };
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
 * @param {string} containerId
 * @param {integer} numInstances
 * @callback {*} onSuccess
 */
export function scaleContainer(fqon, containerId, numInstances, onSuccess) {
  return { type: types.SCALE_CONTAINER_REQUEST, fqon, containerId, numInstances, onSuccess };
}

/**
 * migrateContainer
 * @param {string} fqon
 * @param {string} containerId
 * @param {string} providerId
 * @callback {*} onSuccess
 */
export function migrateContainer(fqon, containerId, providerId, onSuccess) {
  return { type: types.MIGRATE_CONTAINER_REQUEST, fqon, containerId, providerId, onSuccess };
}

/**
 * promoteContainer
 * @param {string} fqon
 * @param {string} containerId
 * @param {string} environmentId
 * @callback {*} onSuccess
 */
export function promoteContainer(fqon, containerId, environmentId, onSuccess) {
  return { type: types.PROMOTE_CONTAINER_REQUEST, fqon, containerId, environmentId, onSuccess };
}

/**
 * fetchProviderContainer
 * @param {string} fqon
 * @param {string} providerId
 */
export function fetchProviderContainer(fqon, providerId) {
  return { type: types.FETCH_PROVIDER_CONTAINER_REQUEST, fqon, providerId };
}

export default {
  unloadContainers,
  unloadContainer,
  fetchContainers,
  fetchContainersDropDown,
  fetchContainer,
  createContainer,
  updateContainer,
  deleteContainer,
  scaleContainer,
  migrateContainer,
  promoteContainer,
  fetchProviderContainer,
};
