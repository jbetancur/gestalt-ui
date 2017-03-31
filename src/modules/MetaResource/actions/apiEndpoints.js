import * as types from '../actionTypes';

/**
 * unloadAPIEndpoints
 */
export function unloadAPIEndpoints() {
  return { type: types.UNLOAD_APIENDPOINTS };
}

/**
 * fetchAPIEndpoints
 * @param {string} fqon
 * @param {string} apiId
 */
export function fetchAPIEndpoints(fqon, apiId) {
  return { type: types.FETCH_APIENDPOINTS_REQUEST, fqon, apiId };
}

/**
 * fetchAPIEndpoint
 * @param {string} fqon
 * @param {string} apiId
 * @param {string} apiendpointId
 */
export function fetchAPIEndpoint(fqon, apiId, apiendpointId) {
  return { type: types.FETCH_APIENDPOINT_REQUEST, fqon, apiId, apiendpointId };
}

/**
 * createAPIEndpoint
 * @param {string} fqon
 * @param {string} apiId
 * @param {Object} payload
 * @callback {*} onSuccess - callback to be performed on success - returns response
 */
export function createAPIEndpoint(fqon, apiId, payload, onSuccess) {
  return { type: types.CREATE_APIENDPOINT_REQUEST, fqon, apiId, payload, onSuccess };
}

/**
 * updateAPIEndpoint
 * @param {string} fqon
 * @param {string} apiId
 * @param {string} apiendpointId
 * @param {Array} payload
 * @callback {*} onSuccess - callback to be performed on success - returns response
 */
export function updateAPIEndpoint(fqon, apiId, apiendpointId, payload, onSuccess) {
  return { type: types.UPDATE_APIENDPOINT_REQUEST, fqon, apiId, apiendpointId, payload, onSuccess };
}

/**
 * deleteAPIEndpoint
 * @param {string} fqon
 * @param {string} apiId
 * @param {string} apiendpointId
 * @callback {*} onSuccess - callback to be performed on success
 */
export function deleteAPIEndpoint(fqon, apiId, apiendpointId, onSuccess) {
  return { type: types.DELETE_APIENDPOINT_REQUEST, fqon, apiId, apiendpointId, onSuccess };
}

/**
 * deleteAPIEndpoints
 * @param {string} apiendpointIds
 * @param {string} fqon
 * @param {string} apiId
 * @callback {*} onSuccess - callback to be performed on success
 */
export function deleteAPIEndpoints(apiendpointIds, fqon, apiId, onSuccess) {
  return { type: types.DELETE_APIENDPOINTS_REQUEST, apiendpointIds, fqon, apiId, onSuccess };
}

export default {
  unloadAPIEndpoints,
  fetchAPIEndpoints,
  fetchAPIEndpoint,
  createAPIEndpoint,
  updateAPIEndpoint,
  deleteAPIEndpoint,
  deleteAPIEndpoints,
};
