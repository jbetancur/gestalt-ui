import * as types from '../actionTypes';

export function fetchLambdas(fqon, environmentId) {
  return { type: types.FETCH_LAMBDAS_REQUEST, fqon, environmentId };
}

export function fetchLambda(fqon, lambdaId, environmentId) {
  return { type: types.FETCH_LAMBDA_REQUEST, fqon, lambdaId, environmentId };
}

export function createLambda(fqon, environmentId, payload, onSuccess) {
  return { type: types.CREATE_LAMBDA_REQUEST, fqon, environmentId, payload, onSuccess };
}

export function updateLambda(fqon, lambdaId, payload, onSuccess) {
  return { type: types.UPDATE_LAMBDA_REQUEST, fqon, lambdaId, payload, onSuccess };
}

export function deleteLambda(fqon, lambdaId, onSuccess) {
  return { type: types.DELETE_LAMBDA_REQUEST, fqon, lambdaId, onSuccess };
}

export function deleteLambdas(lambdaIds, fqon, onSuccess) {
  return { type: types.DELETE_LAMBDAS_REQUEST, lambdaIds, fqon, onSuccess };
}

export default {
  fetchLambdas,
  fetchLambda,
  createLambda,
  updateLambda,
  deleteLambda,
  deleteLambdas,
};
