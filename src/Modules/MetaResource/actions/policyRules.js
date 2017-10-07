import * as types from '../actionTypes';

/**
 * unloadPolicyRules
 */
export function unloadPolicyRules() {
  return { type: types.UNLOAD_POLICYRULES };
}

/**
 * fetchPolicyRules
 * @param {string} fqon
 * @param {string} policyId
 */
export function fetchPolicyRules(fqon, policyId) {
  return { type: types.FETCH_POLICYRULES_REQUEST, fqon, policyId };
}

/**
 * fetchPolicyRule
 * @param {string} fqon
 * @param {string} policyId
 * @param {string} ruleId
 */
export function fetchPolicyRule(fqon, policyId, ruleId) {
  return { type: types.FETCH_POLICYRULE_REQUEST, fqon, policyId, ruleId };
}

/**
 * createPolicyRule
 * @param {string} fqon
 * @param {string} policyId
 * @param {Object} payload
 * @callback {*} onSuccess - callback to be performed on success - returns response
 */
export function createPolicyRule(fqon, policyId, payload, onSuccess) {
  return { type: types.CREATE_POLICYRULE_REQUEST, fqon, policyId, payload, onSuccess };
}

/**
 * updatePolicyRule
 * @param {string} fqon
 * @param {string} policyId
 * @param {string} ruleId
 * @param {Array} payload
 * @callback {*} onSuccess - callback to be performed on success - returns response
 */
export function updatePolicyRule(fqon, policyId, ruleId, payload, onSuccess) {
  return { type: types.UPDATE_POLICYRULE_REQUEST, fqon, policyId, ruleId, payload, onSuccess };
}

/**
 * deletePolicyRule
 * @param {string} fqon
 * @param {string} policyId
 * @param {string} ruleId
 * @callback {*} onSuccess - callback to be performed on success
 */
export function deletePolicyRule(fqon, policyId, ruleId, onSuccess) {
  return { type: types.DELETE_POLICYRULE_REQUEST, fqon, policyId, ruleId, onSuccess };
}

/**
 * deletePolicyRules
 * @param {string} ruleIds
 * @param {string} fqon
 * @param {string} policyId
 * @callback {*} onSuccess - callback to be performed on success
 */
export function deletePolicyRules(ruleIds, fqon, policyId, onSuccess) {
  return { type: types.DELETE_POLICYRULES_REQUEST, ruleIds, fqon, policyId, onSuccess };
}

export default {
  unloadPolicyRules,
  fetchPolicyRules,
  fetchPolicyRule,
  createPolicyRule,
  updatePolicyRule,
  deletePolicyRule,
  deletePolicyRules,
};
