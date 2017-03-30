import * as types from '../actionTypes';

export function fetchProviders(fqon, entityId, entityKey) {
  return { type: types.FETCH_PROVIDERS_REQUEST, fqon, entityId, entityKey };
}

export function fetchProvidersByType(fqon, entityId, entityKey, providerType) {
  return { type: types.FETCH_PROVIDERS_BYTYPE_REQUEST, fqon, entityId, entityKey, providerType };
}

export function fetchExecutors(fqon, entityId, entityKey, executorType) {
  return { type: types.FETCH_EXECUTORS_REQUEST, fqon, entityId, entityKey, executorType };
}

export function fetchProvider(fqon, providerId) {
  return { type: types.FETCH_PROVIDER_REQUEST, fqon, providerId };
}

export function createProvider(fqon, entityId, entityKey, payload, onSuccess) {
  return { type: types.CREATE_PROVIDER_REQUEST, fqon, entityId, entityKey, payload, onSuccess };
}

export function updateProvider(fqon, providerId, payload, onSuccess) {
  return { type: types.UPDATE_PROVIDER_REQUEST, fqon, providerId, payload, onSuccess };
}

export function deleteProvider(fqon, providerId, onSuccess) {
  return { type: types.DELETE_PROVIDER_REQUEST, fqon, providerId, onSuccess };
}

export function deleteProviders(providerIds, fqon, entityId, entityKey, onSuccess) {
  return { type: types.DELETE_PROVIDERS_REQUEST, providerIds, fqon, entityId, entityKey, onSuccess };
}

export default {
  fetchProviders,
  fetchProvidersByType,
  fetchExecutors,
  fetchProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  deleteProviders,
};
