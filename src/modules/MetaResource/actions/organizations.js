import * as types from '../actionTypes';

export function onUnloadAllOrgs() {
  return { type: types.UNLOAD_ALLORGS };
}

export function onUnloadOrg() {
  return { type: types.UNLOAD_ORG };
}

export function onUnloadOrgSet() {
  return { type: types.UNLOAD_ORGSET };
}

export function onUnloadOrgs() {
  return { type: types.UNLOAD_ORGS };
}

export function fetchAllOrgs() {
  return { type: types.FETCH_ALLORGS_REQUEST };
}

export function fetchOrgs() {
  return { type: types.FETCH_ORGS_REQUEST };
}

export function fetchOrg(fqon) {
  return { type: types.FETCH_ORG_REQUEST, fqon };
}

export function fetchOrgSet(fqon) {
  return { type: types.FETCH_ORGSET_REQUEST, fqon };
}

export function createOrg(fqon, payload, onSuccess) {
  return { type: types.CREATE_ORG_REQUEST, fqon, payload, onSuccess };
}

export function updateOrg(fqon, payload, onSuccess) {
  return { type: types.UPDATE_ORG_REQUEST, fqon, payload, onSuccess };
}

export function deleteOrg(fqon, onSuccess) {
  return { type: types.DELETE_ORG_REQUEST, fqon, onSuccess };
}

export default {
  onUnloadAllOrgs,
  onUnloadOrg,
  onUnloadOrgSet,
  onUnloadOrgs,
  fetchAllOrgs,
  fetchOrgs,
  fetchOrgSet,
  fetchOrg,
  createOrg,
  updateOrg,
  deleteOrg,
};
