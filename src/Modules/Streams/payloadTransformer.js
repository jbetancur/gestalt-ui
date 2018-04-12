import jsonPatch from 'fast-json-patch';

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generatePatches(originalPayload, updatedPayload) {
  return jsonPatch.compare(originalPayload, updatedPayload);
}

export default {
  generatePatches,
};
