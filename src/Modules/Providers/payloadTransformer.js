import { cloneDeep } from 'lodash';
import jsonPatch from 'fast-json-patch';
import base64 from 'base-64';
import { metaModels } from 'Modules/MetaResource';


/**
 * generateProviderPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 */
export function generateProviderPayload(sourcePayload, hasContainer) {
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

  if (properties.config.url) {
    payload.properties.config.url = properties.config.url;
  }

  if (properties.config.external_protocol) {
    payload.properties.config.external_protocol = properties.config.external_protocol;
  }

  if (properties.config.auth) {
    payload.properties.config.auth = properties.config.auth;
  }

  if (properties.data) {
    payload.properties.data = base64.encode(properties.data);
    delete payload.properties.config.auth;
    delete payload.properties.config.url;
  }

  if (!hasContainer) {
    delete payload.properties.services;
    return metaModels.provider.create(payload);
  }

  return metaModels.provider.createWithContainerSpec(payload);
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

  // Ugh - check if there is a container - if so then "force" patch op\
  let hasContainer = false;

  if (updatedPayload.properties.services
    && updatedPayload.properties.services.length
    && Object.keys(updatedPayload.properties.services[0].container_spec).length) {
    // TODO: Deal with Patch array issues
    if (updatedPayload.properties.services) {
      delete model.properties.services;
    }

    hasContainer = true;
  }

  return jsonPatch.compare(model, metaModels.provider.patch(generateProviderPayload(updatedPayload, hasContainer)));
}

export default {
  generateProviderPayload,
  generateProviderPatches,
};
