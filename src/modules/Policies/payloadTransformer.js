import { cloneDeep } from 'lodash';
import jsonPatch from 'fast-json-patch';

/**
 * generatePolicyPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Array} mergeSet
 * @param {Object} providersKongByGateway
 * @param {Boolean} updateMode
 */
export function generatePolicyPayload(sourcePayload, updateMode = false) {
  const payload = cloneDeep(sourcePayload);

  if (updateMode) {
    return {
      name: sourcePayload.name,
      description: sourcePayload.description,
    };
  }

  return payload;
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generatePolicyPatches(originalPayload, updatedPayload) {
  const { name, description } = cloneDeep(originalPayload);
  const model = {
    name,
    description,
  };

  return jsonPatch.compare(model, generatePolicyPayload(updatedPayload, true));
}

export default {
  generatePolicyPayload,
  generatePolicyPatches,
};
