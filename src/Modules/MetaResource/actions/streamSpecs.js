import * as types from '../actionTypes';

/**
 * unloadStreamSpecs
 */
export function unloadStreamSpecs() {
  return { type: types.UNLOAD_STREASPECS };
}

/**
 * unloadStreamSpec
 */
export function unloadStreamSpec() {
  return { type: types.UNLOAD_STREAMSPEC };
}

export function fetchStreamSpecs({ fqon, entityId, entityKey }) {
  return { type: types.FETCH_STREAMSPECS_REQUEST, payload: { fqon, entityId, entityKey } };
}

export function fetchStreamSpec({ fqon, id }) {
  return {
    type: types.FETCH_STREAMSPEC_REQUEST, payload: { fqon, id } };
}

export function createStreamSpec({ fqon, entityId, entityKey, payload, onSuccess }) {
  return { type: types.CREATE_STREAMSPEC_REQUEST, payload: { fqon, entityId, entityKey, payload, onSuccess } };
}

export function updateStreamSpec({ fqon, id, payload, onSuccess }) {
  return { type: types.UPDATE_STREAMSPEC_REQUEST, payload: { fqon, id, payload, onSuccess } };
}

export function deleteStreamSpec({ fqon, id, onSuccess }) {
  return { type: types.DELETE_STREAMSPEC_REQUEST, payload: { fqon, id, onSuccess } };
}

export function deleteStreamSpecs({ ids, fqon, onSuccess }) {
  return { type: types.DELETE_STREAMSPECS_REQUEST, payload: { ids, fqon, onSuccess } };
}

export default {
  unloadStreamSpecs,
  unloadStreamSpec,
  fetchStreamSpecs,
  fetchStreamSpec,
  createStreamSpec,
  updateStreamSpec,
  deleteStreamSpec,
  deleteStreamSpecs,
};
