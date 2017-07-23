import { cloneDeep } from 'lodash';

/**
 * generatePolicyPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Array} mergeSet
 * @param {Object} providersKongByGateway
 * @param {Boolean} updateMode
 */
export function generatePolicyPayload(sourcePayload, providersKongByGateway = {}, updateMode = false) {
  const payload = cloneDeep(sourcePayload);

  if (updateMode) {
    return {
      name: sourcePayload.name,
      description: sourcePayload.description,
    };
  }

  return payload;
}

export default {
  generatePolicyPayload,
};
