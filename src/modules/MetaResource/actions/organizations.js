import * as types from '../actionTypes';

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

export function createOrg(fqon, payload, routeToOrg) {
  return { type: types.CREATE_ORG_REQUEST, fqon, payload, routeToOrg };
}

export function updateOrg(fqon, payload, routeToListing) {
  return { type: types.UPDATE_ORG_REQUEST, fqon, payload, routeToListing };
}

export function deleteOrg(fqon, options) {
  return { type: types.DELETE_ORG_REQUEST, fqon, options };
}

export default {
  fetchAllOrgs,
  fetchOrgs,
  fetchOrgSet,
  fetchOrg,
  createOrg,
  updateOrg,
  deleteOrg,
};
