import * as types from '../actionTypes';

/**
 * unloadStreams
 */
export function unloadStreams() {
  return { type: types.UNLOAD_STREAMS };
}

/**
 * unloadStream
 */
export function unloadStream() {
  return { type: types.UNLOAD_STREAM };
}

export function fetchStreams({ fqon, entityId, entityKey }) {
  return { type: types.FETCH_STREAMS_REQUEST, payload: { fqon, entityId, entityKey } };
}

export function fetchStream({ fqon, id }) {
  return {
    type: types.FETCH_STREAM_REQUEST, payload: { fqon, id } };
}

export function createStream({ fqon, entityId, entityKey, payload, onSuccess }) {
  return { type: types.CREATE_STREAM_REQUEST, payload: { fqon, entityId, entityKey, payload, onSuccess } };
}

export function updateStream({ fqon, id, payload, onSuccess }) {
  return { type: types.UPDATE_STREAM_REQUEST, payload: { fqon, id, payload, onSuccess } };
}

export function deleteStream({ fqon, id, onSuccess }) {
  return { type: types.DELETE_STREAM_REQUEST, payload: { fqon, id, onSuccess } };
}

export function deleteStreams({ ids, fqon, onSuccess }) {
  return { type: types.DELETE_STREAMS_REQUEST, payload: { ids, fqon, onSuccess } };
}

export default {
  unloadStreams,
  unloadStream,
  fetchStreams,
  fetchStream,
  createStream,
  updateStream,
  deleteStream,
  deleteStreams,
};
