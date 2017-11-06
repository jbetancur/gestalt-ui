import * as types from '../actionTypes';

/**
 * unloadAPIs
 */
export function unloadAPIs() {
  return { type: types.UNLOAD_APIS };
}

/**
 * unloadAPI
 */
export function unloadAPI() {
  return { type: types.UNLOAD_API };
}

/**
 * fetchAPIs
 * @param {string} fqon
 * @param {string} environmentId
 */
export function fetchAPIs(fqon, environmentId) {
  return { type: types.FETCH_APIS_REQUEST, fqon, environmentId };
}

/**
 * fetchAPI
 * @param {string} fqon
 * @param {string} apiId
 */
export function fetchAPI(fqon, apiId) {
  return { type: types.FETCH_API_REQUEST, fqon, apiId };
}

/**
 * createAPI
 * @param {string} fqon
 * @param {string} environmentId
 * @param {string} payload
 * @callback {*} onSuccess
 */
export function createAPI(fqon, environmentId, payload, onSuccess) {
  return { type: types.CREATE_API_REQUEST, fqon, environmentId, payload, onSuccess };
}

/**
 * updateAPI
 * @param {string} fqon
 * @param {string} environmentId
 * @param {string} apiId
 * @param {Object} payload
 * @callback {*} onSuccess
 */
export function updateAPI(fqon, environmentId, apiId, payload, onSuccess) {
  return { type: types.UPDATE_API_REQUEST, fqon, environmentId, apiId, payload, onSuccess };
}

/**
 * deleteAPI
 * @param {string} fqon
 * @param {string} apiId
 * @callback {*} onSuccess
 */
export function deleteAPI(fqon, apiId, onSuccess) {
  return { type: types.DELETE_API_REQUEST, fqon, apiId, onSuccess };
}

/**
 * deleteAPIs
 * @param {Array} apiIds
 * @param {string} fqon
 * @callback {*} onSuccess
 */
export function deleteAPIs(apiIds, fqon, onSuccess) {
  return { type: types.DELETE_APIS_REQUEST, apiIds, fqon, onSuccess };
}

export default {
  unloadAPIs,
  unloadAPI,
  fetchAPIs,
  fetchAPI,
  createAPI,
  updateAPI,
  deleteAPI,
  deleteAPIs,
};
