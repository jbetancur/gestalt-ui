import * as types from '../actionTypes';

/**
 * unloadSecrets
 */
export function unloadSecrets() {
  return { type: types.UNLOAD_SECRETS };
}

/**
 * fetchSecrets
 * @param {string} fqon
  * @param {string} environmentId
 */
export function fetchSecrets(fqon, environmentId) {
  return { type: types.FETCH_SECRETS_REQUEST, fqon, environmentId };
}

/**
 * fetchSecretsDropDown
 * @param {string} fqon
 * @param {string} environmentId
 */
export function fetchSecretsDropDown(fqon, environmentId) {
  return { type: types.FETCH_SECRETS_DROPDOWN_REQUEST, fqon, environmentId };
}

/**
 * fetchSecret
 * @param {string} fqon
 * @param {string} secretId
 */
export function fetchSecret(fqon, secretId) {
  return { type: types.FETCH_SECRET_REQUEST, fqon, secretId };
}

/**
 * createSecret
 * @param {string} fqon
 * @param {string} environmentId
 * @param {Object} payload
 * @callback {*} onSuccess
 */
export function createSecret(fqon, environmentId, payload, onSuccess) {
  return { type: types.CREATE_SECRET_REQUEST, fqon, environmentId, payload, onSuccess };
}

/**
 * updateSecret
 * @param {string} fqon
 * @param {string} secretId
 * @param {Array} payload
 * @callback {*} onSuccess
 */
export function updateSecret(fqon, secretId, payload, onSuccess) {
  return { type: types.UPDATE_SECRET_REQUEST, fqon, secretId, payload, onSuccess };
}

/**
 * deleteSecret
 * @param {string} fqon
 * @param {string} secretId
 * @callback {*} onSuccess
 */
export function deleteSecret(fqon, secretId, onSuccess) {
  return { type: types.DELETE_SECRET_REQUEST, fqon, secretId, onSuccess };
}

/**
 * deleteSecrets
 * @param {Array} secretIds
 * @param {string} fqon
 * @callback {*} onSuccess
 */
export function deleteSecrets(secretIds, fqon, onSuccess) {
  return { type: types.DELETE_SECRETS_REQUEST, secretIds, fqon, onSuccess };
}

export default {
  unloadSecrets,
  fetchSecrets,
  fetchSecretsDropDown,
  fetchSecret,
  createSecret,
  updateSecret,
  deleteSecret,
  deleteSecrets,
};
