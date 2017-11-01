import * as types from '../actionTypes';

/**
 * onUnloadAllOrgs
 */
export function onUnloadAllOrgs() {
  return { type: types.UNLOAD_ALLORGS };
}

/**
 * onUnloadOrgSet
 */
export function onUnloadOrgSet() {
  return { type: types.UNLOAD_ORGSET };
}

/**
 * unloadOrganization
 */
export function unloadOrganization() {
  return { type: types.UNLOAD_ORGANIZATION };
}

/**
 * fetchAllOrgs
 */
export function fetchAllOrgs() {
  return { type: types.FETCH_ALLORGS_REQUEST };
}

/**
 * fetchAllOrgsDropDown
 * Used for populating a name/value based dropdown with all orgs including the current org
 */
export function fetchAllOrgsDropDown(fqon) {
  return { type: types.FETCH_ALLORGS_DROPDOWN_REQUEST, fqon };
}

/**
 * fetchOrgs
 * @param {string} fqon
 */
export function fetchOrgs(fqon) {
  return { type: types.FETCH_ORGS_REQUEST, fqon };
}

/**
 * fetchOrg
 * @param {string} fqon
 */
export function fetchOrg(fqon) {
  return { type: types.FETCH_ORG_REQUEST, fqon };
}

/**
 * fetchOrgSet
 * @param {string} fqon
 */
export function fetchOrgSet(fqon) {
  return { type: types.FETCH_ORGSET_REQUEST, fqon };
}

/**
 * createOrg
 * @param {string} fqon
 * @param {Object} payload
 * @callback {*} onSuccess
 */
export function createOrg(fqon, payload, onSuccess) {
  return { type: types.CREATE_ORG_REQUEST, fqon, payload, onSuccess };
}

/**
 *
 * @param {string} fqon
 * @param {Array} payload
 * @callback {*} onSuccess
 */
export function updateOrg(fqon, payload, onSuccess) {
  return { type: types.UPDATE_ORG_REQUEST, fqon, payload, onSuccess };
}

/**
 * deleteOrg
 * @param {string} fqon
 * @callback {*} onSuccess
 */
export function deleteOrg(fqon, onSuccess) {
  return { type: types.DELETE_ORG_REQUEST, fqon, onSuccess };
}

export default {
  onUnloadAllOrgs,
  fetchAllOrgsDropDown,
  onUnloadOrgSet,
  unloadOrganization,
  fetchAllOrgs,
  fetchOrgs,
  fetchOrgSet,
  fetchOrg,
  createOrg,
  updateOrg,
  deleteOrg,
};
