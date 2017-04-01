import * as types from '../actionTypes';

/**
 * unloadPolicies
 */
export function unloadPolicies() {
  return { type: types.UNLOAD_POLICIES };
}

/**
 * fetchPolicies
 * @param {string} fqon
 * @param {string} environmentId
 */
export function fetchPolicies(fqon, environmentId) {
  return { type: types.FETCH_POLICIES_REQUEST, fqon, environmentId };
}

/**
 * fetchPolicy
 * @param {string} fqon
 * @param {string} policyId
 */
export function fetchPolicy(fqon, policyId) {
  return { type: types.FETCH_POLICY_REQUEST, fqon, policyId };
}

/**
 * createPolicy
 * @param {string} fqon
 * @param {string} environmentId
 * @param {string} payload
 * @callback {*} onSuccess
 */
export function createPolicy(fqon, environmentId, payload, onSuccess) {
  return { type: types.CREATE_POLICY_REQUEST, fqon, environmentId, payload, onSuccess };
}

/**
 * updatePolicy
 * @param {string} fqon
 * @param {string} environmentId
 * @param {string} policyId
 * @param {Object} payload
 * @callback {*} onSuccess
 */
export function updatePolicy(fqon, policyId, payload, onSuccess) {
  return { type: types.UPDATE_POLICY_REQUEST, fqon, policyId, payload, onSuccess };
}

/**
 * deletePolicy
 * @param {string} fqon
 * @param {string} policyId
 * @callback {*} onSuccess
 */
export function deletePolicy(fqon, policyId, onSuccess) {
  return { type: types.DELETE_POLICY_REQUEST, fqon, policyId, onSuccess };
}

/**
 * deletePolicies
 * @param {Array} policyIds
 * @param {string} fqon
 * @callback {*} onSuccess
 */
export function deletePolicies(policyIds, fqon, onSuccess) {
  return { type: types.DELETE_POLICIES_REQUEST, policyIds, fqon, onSuccess };
}

export default {
  unloadPolicies,
  fetchPolicies,
  fetchPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
  deletePolicies,
};
