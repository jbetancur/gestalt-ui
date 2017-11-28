import * as types from '../actionTypes';

/**
 * unloadAPIEndpoints
 */
export function unloadAPIEndpoints() {
  return { type: types.UNLOAD_APIENDPOINTS };
}

/**
 * unloadAPIEndpoint
 */
export function unloadAPIEndpoint() {
  return { type: types.UNLOAD_APIENDPOINT };
}

/**
 * fetchAPIEndpoints
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey - oneOf lambdas | containers | apis | null
 */
export function fetchAPIEndpoints(fqon, entityId, entityKey) {
  return { type: types.FETCH_APIENDPOINTS_REQUEST, fqon, entityId, entityKey };
}

/**
 * fetchAPIEndpoint
 * @param {string} fqon
 * @param {string} apiId
 * @param {string} apiendpointId
 * @callback {*} onSuccess - callback to be performed on success - returns response
 */
export function fetchAPIEndpoint(fqon, apiId, apiendpointId, onSuccess) {
  return { type: types.FETCH_APIENDPOINT_REQUEST, fqon, apiId, apiendpointId, onSuccess };
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
  unloadAPIEndpoint,
  fetchAPIEndpoints,
  fetchAPIEndpoint,
  createAPIEndpoint,
  updateAPIEndpoint,
  deleteAPIEndpoint,
  deleteAPIEndpoints,
};
