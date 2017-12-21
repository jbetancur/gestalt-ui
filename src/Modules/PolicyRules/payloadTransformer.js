import { cloneDeep } from 'lodash';
import jsonPatch from 'fast-json-patch';

/**
 * generateEventPolicyRulePayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Array} selectedActions
 * @param {Boolean} updateMode
 */
export function generateEventPolicyRulePayload(sourcePayload, selectedActions = [], updateMode = false) {
  const payload = cloneDeep(sourcePayload);

  payload.properties.match_actions = selectedActions;

  if (!updateMode) {
    payload.resource_type = 'Gestalt::Resource::Rule::Event';
  } else {
    payload.properties.lambda = payload.properties.lambda.id;
  }

  return payload;
}

/**
 * generateLimitPolicyRulePayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {*} sourcePayload
 * @param {*} selectedActions
 * @param {*} updateMode
 */
export function generateLimitPolicyRulePayload(sourcePayload, selectedActions = [], updateMode = false) {
  const payload = cloneDeep(sourcePayload);

  payload.properties.match_actions = selectedActions;

  if (!updateMode) {
    payload.resource_type = 'Gestalt::Resource::Rule::Limit';
  }

  return payload;
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 * @param {Object} selectedActions
 */
export function generateEventPolicyRulePatches(originalPayload, updatedPayload, selectedActions) {
  const { name, description, properties } = cloneDeep(originalPayload);
  const model = {
    name,
    description,
    properties
  };

  return jsonPatch.compare(model, generateEventPolicyRulePayload(updatedPayload, selectedActions, true));
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 * @param {Object} selectedActions
 */
export function generateLimitPolicyRulePatches(originalPayload, updatedPayload, selectedActions) {
  const { name, description, properties } = cloneDeep(originalPayload);
  const model = {
    name,
    description,
    properties
  };

  return jsonPatch.compare(model, generateLimitPolicyRulePayload(updatedPayload, selectedActions, true));
}

export default {
  generateEventPolicyRulePayload,
  generateEventPolicyRulePatches,
  generateLimitPolicyRulePayload,
  generateLimitPolicyRulePatches,
};
