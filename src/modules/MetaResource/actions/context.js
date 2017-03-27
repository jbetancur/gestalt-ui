import * as types from '../actionTypes';

export function setCurrentOrgContext(organization) {
  return { type: types.UPDATE_CURRENT_ORG_CONTEXT, payload: organization };
}

export function setCurrentWorkspaceContext(workspace) {
  return { type: types.UPDATE_CURRENT_WORKSPACE_CONTEXT, payload: workspace };
}

export function setCurrentEnvironmentContext(workspace) {
  return { type: types.UPDATE_CURRENT_ENVIRONMENT_CONTEXT, payload: workspace };
}

export function setCurrentOrgContextfromState(fqon) {
  return { type: types.SET_CURRENT_ORG_CONTEXT_REQUEST, fqon };
}

export function setCurrentWorkspaceContextfromState(fqon, workspaceId) {
  return { type: types.SET_CURRENT_WORKSPACE_CONTEXT_REQUEST, fqon, workspaceId };
}

export function setCurrentEnvironmentContextfromState(fqon, environmentId) {
  return { type: types.SET_CURRENT_ENVIRONMENT_CONTEXT_REQUEST, fqon, environmentId };
}

export default {
  setCurrentOrgContext,
  setCurrentWorkspaceContext,
  setCurrentEnvironmentContext,
  setCurrentOrgContextfromState,
  setCurrentWorkspaceContextfromState,
  setCurrentEnvironmentContextfromState,
};
