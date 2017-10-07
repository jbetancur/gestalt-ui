import * as types from '../actionTypes';

/**
 * unloadActions
 */
export function unloadActions() {
  return { type: types.UNLOAD_ACTIONS };
}

/**
 * unloadContextActions
 */
export function unloadContextActions() {
  return { type: types.UNLOAD_CONTEXT_ACTIONS };
}

/**
 * fetchActions
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey oneOf(workspaces || environments || null)
 * @param {Object} filters
 */
export function fetchActions(fqon, entityId, entityKey, filters) {
  return { type: types.FETCH_ACTIONS_REQUEST, fqon, entityId, entityKey, filters };
}

/**
 * fetchContextActions
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey oneOf(workspaces || environments || null)
 * @param {Object} filters
 */
export function fetchContextActions(fqon, entityId, entityKey, filters) {
  return { type: types.FETCH_CONTEXT_ACTIONS_REQUEST, fqon, entityId, entityKey, filters };
}

export default {
  unloadActions,
  unloadContextActions,
  fetchActions,
  fetchContextActions,
};
