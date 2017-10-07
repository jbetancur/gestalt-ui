import * as types from '../actionTypes';

/**
 * unloadSearch
 */
export function unloadSearch() {
  return { type: types.UNLOAD_SEARCH };
}

/**
 * doSearch
 * @param {string} fqon
 * @param {string} entity
 * @param {string} value
 * @param {string} field - Optional
 */
export function doSearch(fqon, entity, value, field) {
  return { type: types.FETCH_SEARCH_REQUEST, fqon, entity, value, field };
}

export default {
  unloadSearch,
  doSearch,
};
