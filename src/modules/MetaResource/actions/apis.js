import * as types from '../actionTypes';

export function fetchAPIs(fqon, environmentId) {
  return { type: types.FETCH_APIS_REQUEST, fqon, environmentId };
}

export function fetchAPI(fqon, apiId) {
  return { type: types.FETCH_API_REQUEST, fqon, apiId };
}

export function createAPI(fqon, environmentId, payload, onSuccess) {
  return { type: types.CREATE_API_REQUEST, fqon, environmentId, payload, onSuccess };
}

export function updateAPI(fqon, environmentId, apiId, payload, onSuccess) {
  return { type: types.UPDATE_API_REQUEST, fqon, environmentId, apiId, payload, onSuccess };
}

export function deleteAPI(fqon, apiId, onSuccess) {
  return { type: types.DELETE_API_REQUEST, fqon, apiId, onSuccess };
}

export function deleteAPIs(apiIds, fqon, onSuccess) {
  return { type: types.DELETE_APIS_REQUEST, apiIds, fqon, onSuccess };
}

export default {
  fetchAPIs,
  fetchAPI,
  createAPI,
  updateAPI,
  deleteAPI,
  deleteAPIs,
};
