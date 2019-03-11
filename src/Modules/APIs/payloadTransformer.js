import cloneDeep from 'lodash/cloneDeep';
import jsonPatch from 'fast-json-patch';

/**
 * generateAPIPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Object} providersKongByGateway
 * @param {Boolean} updateMode
 */
export function generateAPIPayload(sourcePayload, providersKongByGateway = {}, updateMode = false) {
  const payload = cloneDeep(sourcePayload);

  if (updateMode) {
    return {
      name: payload.name,
      description: payload.description,
    };
  }

  // TODO: this will eventually go away
  // get the gateway provider Id from our frankenstein provider
  const selectedProvider = providersKongByGateway.find(provider => provider.id === payload.properties.provider.locations);
  payload.properties.provider.id = selectedProvider.properties.gatewayProvider && selectedProvider.properties.gatewayProvider.id; // this is really the Gatewayprovier.id
  // locations is an array, but we only need the first value to be the kong id
  payload.properties.provider.locations = [payload.properties.provider.locations]; // this is really the kong provider id

  return payload;
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generateAPIPatches(originalPayload, updatedPayload) {
  const model = cloneDeep({
    name: originalPayload.name,
    description: originalPayload.description,
  });

  return jsonPatch.compare(model, generateAPIPayload(updatedPayload, null, true));
}

export default {
  generateAPIPayload,
  generateAPIPatches,
};
