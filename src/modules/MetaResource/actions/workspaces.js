import * as types from '../actionTypes';

/**
 * fetchWorkspaces
 * @param {string} fqon
 */
export function fetchWorkspaces(fqon) {
  return { type: types.FETCH_WORKSPACES_REQUEST, fqon };
}

/**
 * fetchWorkspace
 * @param {string} fqon
 * @param {string} workspaceId
 */
export function fetchWorkspace(fqon, workspaceId) {
  return { type: types.FETCH_WORKSPACE_REQUEST, fqon, workspaceId };
}

/**
 * createWorkspace
 * @param {string} fqon
 * @param {Object} payload
 * @callback {*} onSuccess
 */
export function createWorkspace(fqon, payload, onSuccess) {
  return { type: types.CREATE_WORKSPACE_REQUEST, fqon, payload, onSuccess };
}

/**
 *
 * @param {string} fqon
 * @param {string} workspaceId
 * @param {Array} payload
 * @callback {*} onSuccess
 */
export function updateWorkspace(fqon, workspaceId, payload, onSuccess) {
  return { type: types.UPDATE_WORKSPACE_REQUEST, fqon, workspaceId, payload, onSuccess };
}

/**
 *
 * @param {string} fqon
 * @param {string} workspaceId
 * @callback {*} onSuccess
 */
export function deleteWorkspace(fqon, workspaceId, onSuccess) {
  return { type: types.DELETE_WORKSPACE_REQUEST, fqon, workspaceId, onSuccess };
}


export default {
  fetchWorkspaces,
  fetchWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
