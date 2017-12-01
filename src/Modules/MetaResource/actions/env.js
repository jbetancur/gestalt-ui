import * as types from '../actionTypes';

/**
 * unloadEnvSchema
 */
export function unloadEnvSchema() {
  return { type: types.UNLOAD_ENV_SCHEMA };
}

/**
 * fetchEnv
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey - oneOf workspaces | environments | null
 */
export function fetchEnv(fqon, entityId, entityKey) {
  return { type: types.FETCH_ENV_REQUEST, fqon, entityId, entityKey };
}

/**
 * fetchEnvSchema
 * @param {string} resourceTypeId
 */
export function fetchEnvSchema(resourceTypeId) {
  return { type: types.FETCH_ENV_SCHEMA_REQUEST, resourceTypeId };
}

export default {
  unloadEnvSchema,
  fetchEnv,
  fetchEnvSchema,
};
