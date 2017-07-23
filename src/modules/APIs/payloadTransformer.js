import { cloneDeep } from 'lodash';

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
      name: sourcePayload.name,
      description: sourcePayload.description,
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

export default {
  generateAPIPayload,
};
