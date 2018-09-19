import jsonPatch from 'fast-json-patch';
import yaml from 'js-yaml';
import volumeModel from './models/volume';

/**
 * generatePayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Boolean} updateMode
 */
export function generatePayload(sourcePayload) {
  const payload = volumeModel.create(sourcePayload);
  if (payload.properties.type === 'external' && typeof payload.properties.yaml) {
    payload.properties.config = yaml.safeLoad(payload.properties.yaml);
    delete payload.properties.yaml;
  }

  if (payload.properties.size_unit === 'GiB') {
    payload.properties.size *= 1024;
  }

  return payload;
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generatePatches(originalPayload, updatedPayload) {
  const payload = volumeModel.patch(originalPayload);

  return jsonPatch.compare(payload, generatePayload(updatedPayload, true));
}

export default {
  generatePayload,
  generatePatches,
};
