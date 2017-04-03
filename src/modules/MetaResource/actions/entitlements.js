import * as types from '../actionTypes';

/**
 * unloadEntitlements
 * Handle Clearing the state. This should be called when a component unmounts
 */
export function unloadEntitlements() {
  return { type: types.UNLOAD_ENTITLEMENTS };
}

/**
 * fetchEntitlements
 * Fetch Entitlements and transform them into something more usable. NOTE: this will be refactored in a future release when the API
 * is capable of handling entitlements better
 * @param {string} fqon
 * @param {string} entityId
 * @param {string} entityKey
 * @param {Object} selectedIdentity
 */
export function fetchEntitlements(fqon, entityId, entityKey, selectedIdentity) {
  return { type: types.FETCH_ENTITLEMENTS_REQUEST, fqon, entityId, entityKey, selectedIdentity };
}

/**
 * fetchIdentities
 * Fetch all users and groups and concat into a single identies array
 * @param {string} fqon
 */
export function fetchIdentities(fqon) {
  return { type: types.FETCH_IDENTITIES_REQUEST, fqon };
}

/**
 * Update Entitlements
 * @param {string} fqon
 * @param {string} newIdentity
 * @param {Array} actions
 * @param {string} entityId
 * @param {string} entityKey
 * @callback {*} onSuccess
 */
export function updateEntitlements(fqon, newIdentity, actions, entityId, entityKey, onSuccess) {
  return { type: types.UPDATE_ENTITLEMENT_REQUEST, fqon, newIdentity, actions, entityId, entityKey, onSuccess };
}

export default {
  unloadEntitlements,
  fetchEntitlements,
  fetchIdentities,
  updateEntitlements,
};
