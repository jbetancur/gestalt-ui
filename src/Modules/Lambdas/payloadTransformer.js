// import base64 from 'base-64';
// import { get } from 'lodash';
import jsonPatch from 'fast-json-patch';
import lambdaModel from './models/lambda';

/**
 * generatePayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Boolean} updateMode
 */
export function generatePayload(sourcePayload, updateMode = false) {
  const model = lambdaModel.create(sourcePayload);

  if (!updateMode) {
    // TODO: Fake Locations
    model.properties.provider = { id: model.properties.provider.id, locations: [] };
  }

  return model;
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generatePatches(originalPayload, updatedPayload) {
  const model = lambdaModel.patch(originalPayload);

  // TODO: Deal with Patch array issues
  if (updatedPayload.properties.secrets) {
    delete model.properties.secrets;
  }

  return jsonPatch.compare(model, lambdaModel.patch(updatedPayload));
}

export default {
  generatePayload,
  generatePatches,
};
