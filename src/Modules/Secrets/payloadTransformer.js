import { cloneDeep } from 'lodash';
import base64 from 'base-64';
import jsonPatch from 'fast-json-patch';

/**
 * generateSecretPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Boolean} updateMode
 */
export function generateSecretPayload(sourcePayload, updateMode = false) {
  const payload = cloneDeep(sourcePayload);

  if (updateMode) {
    return {
      name: sourcePayload.name,
      description: sourcePayload.description,
    };
  }

  payload.properties.items = sourcePayload.properties.items.map(item => ({ key: item.key, value: base64.encode(item.value) }));

  return payload;
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generateSecretPatches(originalPayload, updatedPayload) {
  const { name, description } = cloneDeep(originalPayload);
  const model = {
    name,
    description,
  };

  return jsonPatch.compare(model, generateSecretPayload(updatedPayload, true));
}

export default {
  generateSecretPayload,
  generateSecretPatches,
};
