import * as types from '../actionTypes';

/**
 * fetchEnv
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey - oneOf workspaces | environments | null
 */
export function fetchEnv(fqon, entityId, entityKey) {
  return { type: types.FETCH_ENV_REQUEST, fqon, entityId, entityKey };
}

export default {
  fetchEnv,
};
