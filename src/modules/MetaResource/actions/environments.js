import * as types from '../actionTypes';

export function onUnloadEnvironment() {
  return { type: types.UNLOAD_ENVIRONMENT };
}

export function onUnloadEnvironments() {
  return { type: types.UNLOAD_ENVIRONMENTS };
}

export function fetchEnvironments(fqon, workspaceId) {
  return { type: types.FETCH_ENVIRONMENTS_REQUEST, fqon, workspaceId };
}

export function fetchEnvironment(fqon, environmentId) {
  return { type: types.FETCH_ENVIRONMENT_REQUEST, fqon, environmentId };
}

export function createEnvironment(fqon, workspaceId, payload, onSuccess) {
  return { type: types.CREATE_ENVIRONMENT_REQUEST, fqon, workspaceId, payload, onSuccess };
}

export function updateEnvironment(fqon, environmentId, payload, onSuccess) {
  return { type: types.UPDATE_ENVIRONMENT_REQUEST, fqon, environmentId, payload, onSuccess };
}

export function deleteEnvironment(fqon, environmentId, onSuccess) {
  return { type: types.DELETE_ENVIRONMENT_REQUEST, fqon, environmentId, onSuccess };
}

export default {
  onUnloadEnvironment,
  onUnloadEnvironments,
  fetchEnvironments,
  fetchEnvironment,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
};
