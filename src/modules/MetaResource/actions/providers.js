import * as types from '../actionTypes';

/**
 * unloadProviders
 */
export function unloadProviders() {
  return { type: types.UNLOAD_PROVIDERS };
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
 * fetchProvidersByType
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey oneOf(workspaces || environments || null)
 * @param {string} providerType oneOf(CaaS || Lambda || GatewayManager)
 */
export function fetchProvidersByType(fqon, entityId, entityKey, providerType) {
  return { type: types.FETCH_PROVIDERS_BYTYPE_REQUEST, fqon, entityId, entityKey, providerType };
}

/**
 * fetchExecutors
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey oneOf(workspaces || environments || null)
 * @param {*} executorType oneOf(Executors)
 */
export function fetchExecutors(fqon, entityId, entityKey, executorType) {
  return { type: types.FETCH_EXECUTORS_REQUEST, fqon, entityId, entityKey, executorType };
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
export function deleteProvider(fqon, providerId, onSuccess) {
  return { type: types.DELETE_PROVIDER_REQUEST, fqon, providerId, onSuccess };
}

/**
 * deleteProviders
 * @param {Array} providerIds
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey oneOf(workspaces || environments || null)
 * @callback {*} onSuccess
 */
export function deleteProviders(providerIds, fqon, entityId, entityKey, onSuccess) {
  return { type: types.DELETE_PROVIDERS_REQUEST, providerIds, fqon, entityId, entityKey, onSuccess };
}

export default {
  unloadProviders,
  fetchProviders,
  fetchProvidersByType,
  fetchExecutors,
  fetchProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  deleteProviders,
};
