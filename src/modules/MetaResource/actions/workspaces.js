import * as types from '../actionTypes';

export function onUnloadWorkspace() {
  return { type: types.UNLOAD_WORKSPACE };
}

export function onUnloadWorkspaces() {
  return { type: types.UNLOAD_WORKSPACES };
}

export function fetchWorkspaces(fqon) {
  return { type: types.FETCH_WORKSPACES_REQUEST, fqon };
}

export function fetchWorkspace(fqon, workspaceId) {
  return { type: types.FETCH_WORKSPACE_REQUEST, fqon, workspaceId };
}

export function createWorkspace(fqon, payload, onSuccess) {
  return { type: types.CREATE_WORKSPACE_REQUEST, fqon, payload, onSuccess };
}

export function updateWorkspace(fqon, workspaceId, payload, onSuccess) {
  return { type: types.UPDATE_WORKSPACE_REQUEST, fqon, workspaceId, payload, onSuccess };
}

export function deleteWorkspace(fqon, workspaceId, onSuccess) {
  return { type: types.DELETE_WORKSPACE_REQUEST, fqon, workspaceId, onSuccess };
}


export default {
  onUnloadWorkspace,
  onUnloadWorkspaces,
  fetchWorkspaces,
  fetchWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
