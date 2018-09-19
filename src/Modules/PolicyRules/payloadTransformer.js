import jsonPatch from 'fast-json-patch';
import policyRuleModel from './models/policyRule';

/**
 * generatePayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Array} selectedActions
 * @param {Boolean} updateMode
 * @param {String} policyType - limit || event
 */
export function generatePayload(sourcePayload, selectedActions = [], updateMode = false, policyType) {
  const payload = policyRuleModel.create(sourcePayload);

  payload.properties.match_actions = selectedActions;

  if (!updateMode) {
    if (policyType === 'limit') {
      payload.resource_type = 'Gestalt::Resource::Rule::Limit';
    }

    if (policyType === 'event') {
      payload.resource_type = 'Gestalt::Resource::Rule::Event';

      if (payload.properties.strict) {
        delete payload.properties.strict;
      }

      if (payload.properties.eval_logic) {
        delete payload.properties.eval_logic;
      }
    }
  }

  if (updateMode) {
    if (policyType === 'event') {
      payload.properties.lambda = payload.properties.lambda.id;
    }
  }

  return payload;
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 * @param {Object} selectedActions
 * @param {String} policyType - limit || event
 */
export function generatePatches(originalPayload, updatedPayload, selectedActions, policyType) {
  const payload = policyRuleModel.create(originalPayload);

  return jsonPatch.compare(payload, generatePayload(updatedPayload, selectedActions, true, policyType));
}

export default {
  generatePayload,
  generatePatches,
};
