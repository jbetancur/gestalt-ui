import { cloneDeep } from 'lodash';
import jsonPatch from 'fast-json-patch';
import base64 from 'base-64';
import providerModel from './models/provider';


/**
 * generateProviderPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 */
export function generateProviderPayload(sourcePayload, hasContainer, patchMode) {
  const {
    name,
    description,
    resource_type,
    properties,
  } = cloneDeep(sourcePayload);

  const payload = {
    name,
    description,
    resource_type,
    properties: {
      ...properties,
    },
  };

  // encode on creation
  if (properties.data && !patchMode) {
    payload.properties.data = base64.encode(properties.data);
    delete payload.properties.config.auth;
    delete payload.properties.config.url;
  }

  // patch the temp prop and re-encode
  if (patchMode && properties.tempData) {
    payload.properties.data = base64.encode(properties.tempData);
  }

  if (hasContainer) {
    return providerModel.createWithContainerSpec(payload);
  }

  return providerModel.create(payload);
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generateProviderPatches(originalPayload, updatedPayload) {
  const { name, description, properties: { config, linked_providers, environment_types, services } } = cloneDeep(originalPayload);
  const model = {
    name,
    description,
    properties: {
      config,
      linked_providers,
      environment_types,
      services,
    },
  };

  // TODO: Deal with Patch array issues
  if (updatedPayload.properties.linked_providers) {
    delete model.properties.linked_providers;
  }

  // TODO: Since we dont want to treat networks JSON as a patch array index
  if (updatedPayload.properties.config.networks) {
    delete model.properties.config.networks;
  }

  // Ugh - check if there is a container - if so then "force" patch op
  if (updatedPayload.properties.services
    && updatedPayload.properties.services.length
    && updatedPayload.properties.services[0].container_spec
    && updatedPayload.properties.services[0].container_spec.name) {
    // TODO: Deal with Patch array issues - this is sloppy but no other easy way - short story is the meta model for provider containers is fubar
    delete model.properties.services;

    return jsonPatch.compare(model, providerModel.patchWithContainerSpec(generateProviderPayload(updatedPayload, true, true)));
  }

  // remove residual services so we don't patch it
  delete model.properties.services;

  return jsonPatch.compare(model, providerModel.patch(generateProviderPayload(updatedPayload, false, true)));
}

export default {
  generateProviderPayload,
  generateProviderPatches,
};
