import * as types from '../actionTypes';

export function fetchWorkspaces(fqon) {
  return { type: types.FETCH_WORKSPACES_REQUEST, fqon };
}

export function fetchWorkspace(fqon, workspaceId) {
  return { type: types.FETCH_WORKSPACE_REQUEST, fqon, workspaceId };
}

export default {
  fetchWorkspaces,
  fetchWorkspace,
};
