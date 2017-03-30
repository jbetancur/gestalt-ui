import * as types from '../actionTypes';

export function fetchAPIEndpoints(fqon, apiId) {
  return { type: types.FETCH_APIENDPOINTS_REQUEST, fqon, apiId };
}

export function fetchAPIEndpoint(fqon, apiId, apiendpointId) {
  return { type: types.FETCH_APIENDPOINT_REQUEST, fqon, apiId, apiendpointId };
}

export function createAPIEndpoint(fqon, apiId, payload, onSuccess) {
  return { type: types.CREATE_APIENDPOINT_REQUEST, fqon, apiId, payload, onSuccess };
}

export function updateAPIEndpoint(fqon, apiId, apiendpointId, payload, onSuccess) {
  return { type: types.UPDATE_APIENDPOINT_REQUEST, fqon, apiId, apiendpointId, payload, onSuccess };
}

export function deleteAPIEndpoint(fqon, apiId, apiendpointId, onSuccess) {
  return { type: types.DELETE_APIENDPOINT_REQUEST, fqon, apiId, apiendpointId, onSuccess };
}

export function deleteAPIEndpoints(apiendpointIds, fqon, apiId, onSuccess) {
  return { type: types.DELETE_APIENDPOINTS_REQUEST, apiendpointIds, fqon, apiId, onSuccess };
}

export default {
  fetchAPIEndpoints,
  fetchAPIEndpoint,
  createAPIEndpoint,
  updateAPIEndpoint,
  deleteAPIEndpoint,
  deleteAPIEndpoints,
};
