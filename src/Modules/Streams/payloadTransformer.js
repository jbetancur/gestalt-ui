import jsonPatch from 'fast-json-patch';
import streamSpecMode from './models/streamSpec';

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generatePatches(originalPayload, updatedPayload) {
  return jsonPatch.compare(
    streamSpecMode.patch(originalPayload),
    streamSpecMode.patch(updatedPayload)
  );
}

export default {
  generatePatches,
};
