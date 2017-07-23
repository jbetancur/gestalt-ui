import { cloneDeep, compact } from 'lodash';

/**
 * generateAPIEndpointPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Boolean} updateMode
 */
export function generateAPIEndpointPayload(sourcePayload, updateMode = false) {
  const payload = cloneDeep(sourcePayload);

  payload.name = payload.properties.resource.split('/').join('-');

  if (updateMode) {
    // meta patch cannot currently handle array patching - so force a replace on /properties/methods
    delete payload.properties.methods;
  }

  // convert comma delimited string to an array and remove blank entries
  if (sourcePayload.properties.methods) {
    payload.properties.methods = compact(sourcePayload.properties.methods.split(','));
  }

  return payload;
}

export default {
  generateAPIEndpointPayload,
};
