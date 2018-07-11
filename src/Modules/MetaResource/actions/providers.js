import * as types from '../actionTypes';

/**
 * unloadProviders
 */
export function unloadProviders() {
  return { type: types.UNLOAD_PROVIDERS };
}

/**
 * unloadProvider
 */
export function unloadProvider() {
  return { type: types.UNLOAD_PROVIDER };
}

/**
 * fetchProviders
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey oneOf(workspaces || environments || null)
 */
export function fetchProviders(fqon, entityId, entityKey) {
  return { type: types.FETCH_PROVIDERS_REQUEST, fqon, entityId, entityKey };
}

/**
 * fetchProvider
 * @param {string} fqon
 * @param {string} providerId
 */
export function fetchProvider(fqon, providerId) {
  return { type: types.FETCH_PROVIDER_REQUEST, fqon, providerId };
}

/**
 * createProvider
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey oneOf(workspaces || environments || null)
 * @param {Object} payload
 * @callback {*} onSuccess
 */
export function createProvider(fqon, entityId, entityKey, payload, onSuccess) {
  return { type: types.CREATE_PROVIDER_REQUEST, fqon, entityId, entityKey, payload, onSuccess };
}

/**
 * updateProvider
 * @param {string} fqon
 * @param {string} providerId
 * @param {Array} payload
 * @callback {*} onSuccess
 */
export function updateProvider(fqon, providerId, payload, onSuccess) {
  return { type: types.UPDATE_PROVIDER_REQUEST, fqon, providerId, payload, onSuccess };
}

/**
 * deleteProvider
 * @param {string} fqon
 * @param {string} providerId
 * @callback {*} onSuccess
 */
export function deleteProvider(fqon, providerId, onSuccess, force) {
  return { type: types.DELETE_PROVIDER_REQUEST, fqon, providerId, onSuccess, force };
}

/**
 * deleteProviders
 * @param {Array} providerIds
 * @param {string} fqon
 * @callback {*} onSuccess
 */
export function deleteProviders(providerIds, fqon, onSuccess, force) {
  return { type: types.DELETE_PROVIDERS_REQUEST, providerIds, fqon, onSuccess, force };
}

/**
 * redeployProvider
 * @param {string} fqon
 * @param {string} providerId
 * @callback {*} onSuccess
 */
export function redeployProvider(fqon, providerId, onSuccess) {
  return { type: types.REDEPLOY_PROVIDER_REQUEST, fqon, providerId, onSuccess };
}

export default {
  unloadProviders,
  unloadProvider,
  fetchProviders,
  fetchProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  deleteProviders,
  redeployProvider,
};
