import { cloneDeep } from 'lodash';

/**
 * generateEventPolicyRulePayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Array} selectedActions
 * @param {Boolean} updateMode
 */
export function generateEventPolicyRulePayload(sourcePayload, selectedActions = [], updateMode = false) {
  const payload = cloneDeep(sourcePayload);

  payload.properties.actions = selectedActions;

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

  payload.properties.actions = selectedActions;

  if (!updateMode) {
    payload.resource_type = 'Gestalt::Resource::Rule::Limit';
  }

  return payload;
}

export default {
  generateEventPolicyRulePayload,
  generateLimitPolicyRulePayload,
};
