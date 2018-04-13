import * as types from '../actionTypes';

/**
 * unloadLambdas
 */
export function unloadLambdas() {
  return { type: types.UNLOAD_LAMBDAS };
}

/**
 * unloadLambda
 */
export function unloadLambda() {
  return { type: types.UNLOAD_LAMBDA };
}

/**
 * fetchLambdas
 * @param {string} fqon
 * @param {string} environmentId
 */
export function fetchLambdas(fqon, environmentId) {
  return { type: types.FETCH_LAMBDAS_REQUEST, fqon, environmentId };
}

/**
 * fetchLambda
 * @param {string} fqon
 * @param {string} lambdaId
 */
export function fetchLambda(fqon, lambdaId) {
  return { type: types.FETCH_LAMBDA_REQUEST, fqon, lambdaId };
}

/**
 * createLambda
 * @param {string} fqon
 * @param {string} environmentId
 * @param {Object} payload
 * @callbak {*} onSuccess
 */
export function createLambda(fqon, environmentId, payload, onSuccess) {
  return { type: types.CREATE_LAMBDA_REQUEST, fqon, environmentId, payload, onSuccess };
}

/**
 * updateLambda
 * @param {string} fqon
 * @param {string} lambdaIds
 * @param {Array} payload
 * @callbak {*} onSuccess
 */
export function updateLambda(fqon, lambdaId, payload, onSuccess) {
  return { type: types.UPDATE_LAMBDA_REQUEST, fqon, lambdaId, payload, onSuccess };
}

/**
 * deleteLambda
 * @param {string} fqon
 * @param {string} lambdaId
 * @callbak {*} onSuccess
 */
export function deleteLambda(fqon, lambdaId, onSuccess) {
  return { type: types.DELETE_LAMBDA_REQUEST, fqon, lambdaId, onSuccess };
}

/**
 * deleteLambdas
 * @param {Array} lambdaIds
 * @param {string} fqon
 * @callbak {*} onSuccess
 */
export function deleteLambdas(lambdaIds, fqon, onSuccess) {
  return { type: types.DELETE_LAMBDAS_REQUEST, lambdaIds, fqon, onSuccess };
}

/**
 * fetchLambdaProvider
 * @param {string} fqon
 * @param {string} lambdaId
 */
export function fetchLambdaProvider(fqon, lambdaId) {
  return { type: types.FETCH_LAMBDA_PROVIDER_REQUEST, fqon, lambdaId };
}

export default {
  unloadLambdas,
  unloadLambda,
  fetchLambdas,
  fetchLambda,
  createLambda,
  updateLambda,
  deleteLambda,
  deleteLambdas,
  fetchLambdaProvider,
};
