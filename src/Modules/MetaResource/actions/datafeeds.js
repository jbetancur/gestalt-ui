import * as types from '../actionTypes';

/**
 * unloadDatafeeds
 */
export function unloadDatafeeds() {
  return { type: types.UNLOAD_DATAFEEDS };
}

/**
 * unloadDatafeed
 */
export function unloadDatafeed() {
  return { type: types.UNLOAD_DATAFEED };
}

export function fetchDatafeeds({ fqon, entityId, entityKey }) {
  return { type: types.FETCH_DATAFEEDS_REQUEST, payload: { fqon, entityId, entityKey } };
}

export function fetchDatafeed({ fqon, id }) {
  return {
    type: types.FETCH_DATAFEED_REQUEST, payload: { fqon, id } };
}

export function createDatafeed({ fqon, entityId, entityKey, payload, onSuccess }) {
  return { type: types.CREATE_DATAFEED_REQUEST, payload: { fqon, entityId, entityKey, payload, onSuccess } };
}

export function updateDatafeed({ fqon, id, payload, onSuccess }) {
  return { type: types.UPDATE_DATAFEED_REQUEST, payload: { fqon, id, payload, onSuccess } };
}

export function deleteDatafeed({ fqon, id, onSuccess }) {
  return { type: types.DELETE_DATAFEED_REQUEST, payload: { fqon, id, onSuccess, params: { force: true } } };
}

export function deleteDatafeeds({ ids, fqon, onSuccess }) {
  return { type: types.DELETE_DATAFEEDS_REQUEST, payload: { ids, fqon, onSuccess, params: { force: true } } };
}

export default {
  unloadDatafeeds,
  unloadDatafeed,
  fetchDatafeeds,
  fetchDatafeed,
  createDatafeed,
  updateDatafeed,
  deleteDatafeed,
  deleteDatafeeds,
};
