import base64 from 'base-64';
import jsonPatch from 'fast-json-patch';
import { metaModels } from 'Modules/MetaResource';

/**
 * generatePayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Boolean} updateMode
 */
export function generatePayload(sourcePayload, updateMode = false) {
  const payload = metaModels.secret.create(sourcePayload);

  if (updateMode) {
    return {
      name: sourcePayload.name,
      description: sourcePayload.description,
    };
  }

  payload.properties.items = payload.properties.items.map(item => ({ key: item.key, value: item.isFile ? item.value : base64.encode(item.value) }));

  return payload;
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generatePatches(originalPayload, updatedPayload) {
  const { name, description } = metaModels.secret.create(originalPayload);
  const model = {
    name,
    description,
  };

  return jsonPatch.compare(model, generatePayload(updatedPayload, true));
}

export default {
  generatePayload,
  generatePatches,
};
