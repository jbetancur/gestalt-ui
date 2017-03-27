import * as types from '../actionTypes';

export function fetchEnvironments(fqon, workspaceId) {
  return { type: types.FETCH_ENVIRONMENTS_REQUEST, fqon, workspaceId };
}

export function fetchEnvironment(fqon, environmentId) {
  return { type: types.FETCH_ENVIRONMENT_REQUEST, fqon, environmentId };
}

export default {
  fetchEnvironments,
  fetchEnvironment,
};
