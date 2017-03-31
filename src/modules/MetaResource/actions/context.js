import * as types from '../actionTypes';

/**
 * setCurrentOrgContext
 * @param {*} organization
 */
export function setCurrentOrgContext(organization) {
  return { type: types.UPDATE_CURRENT_ORG_CONTEXT, payload: organization };
}

/**
 * setCurrentWorkspaceContext
 * @param {*} workspace
 */
export function setCurrentWorkspaceContext(workspace) {
  return { type: types.UPDATE_CURRENT_WORKSPACE_CONTEXT, payload: workspace };
}

/**
 * setCurrentEnvironmentContext
 * @param {*} workspace
 */
export function setCurrentEnvironmentContext(workspace) {
  return { type: types.UPDATE_CURRENT_ENVIRONMENT_CONTEXT, payload: workspace };
}

/**
 * setCurrentOrgContextfromState
 * @param {*} fqon
 */
export function setCurrentOrgContextfromState(fqon) {
  return { type: types.SET_CURRENT_ORG_CONTEXT_REQUEST, fqon };
}

/**
 * setCurrentWorkspaceContextfromState
 * @param {*} fqon
 * @param {*} workspaceId
 */
export function setCurrentWorkspaceContextfromState(fqon, workspaceId) {
  return { type: types.SET_CURRENT_WORKSPACE_CONTEXT_REQUEST, fqon, workspaceId };
}

/**
 * setCurrentEnvironmentContextfromState
 * @param {*} fqon
 * @param {*} environmentId
 */
export function setCurrentEnvironmentContextfromState(fqon, environmentId) {
  return { type: types.SET_CURRENT_ENVIRONMENT_CONTEXT_REQUEST, fqon, environmentId };
}

/**
 * unloadWorkspaceContext
 */
export function unloadWorkspaceContext() {
  return { type: types.UNLOAD_CURRENT_WORKSPACE_CONTEXT };
}

/**
 * unloadEnvironmentContext
 */
export function unloadEnvironmentContext() {
  return { type: types.UNLOAD_CURRENT_ENVIRONMENT_CONTEXT };
}

export default {
  setCurrentOrgContext,
  setCurrentWorkspaceContext,
  setCurrentEnvironmentContext,
  setCurrentOrgContextfromState,
  setCurrentWorkspaceContextfromState,
  setCurrentEnvironmentContextfromState,
  unloadWorkspaceContext,
  unloadEnvironmentContext,
};
