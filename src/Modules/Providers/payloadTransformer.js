import { cloneDeep } from 'lodash';
import jsonPatch from 'fast-json-patch';
import base64 from 'base-64';
import { arrayToMap, stringDemiltedToArray } from 'util/helpers/transformations';
import { payloadTransformer } from 'Modules/Containers';

// import { mapTo2DArray } from 'util/helpers/transformations';
/**
 * generateProviderPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Array} mergeContainerProps
 * @param {Object} containerValues
 * @param {Boolean} updateMode
 */
export function generateProviderPayload(sourcePayload, mergeContainerProps = [], containerValues = {}, updateMode = false) {
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
      config: {
        ...properties.config,
        env: {
          public: arrayToMap(properties.config.env.public, 'name', 'value'),
          private: arrayToMap(properties.config.env.private, 'name', 'value'),
        },
      },
      services: [],
      linked_providers: properties.linked_providers,
      locations: properties.locations,
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

  if (properties.config.extra) {
    payload.properties.config.extra = JSON.parse(properties.config.extra);
  }

  if (properties.config.networks) {
    payload.properties.config.networks = JSON.parse(properties.config.networks);
  }

  if (properties.environment_types) {
    payload.properties.environment_types = stringDemiltedToArray(sourcePayload.properties.environment_types);
  }

  // when the string is blank then convert to an empty array
  if (properties.environment_types === '') {
    payload.properties.environment_types = [];
  }

  // Handle our container Form and map to the provider payload
  if (Object.keys(containerValues).length) {
    const containerServicepayload = {
      init: {
        binding: 'eager',
        singleton: true,
      },
      container_spec: {},
    };

    payload.properties.services.push(containerServicepayload);
    payload.properties.services[0].container_spec = payloadTransformer.generateContainerPayload(containerValues, mergeContainerProps);
  }

  if (updateMode) {
    delete payload.resource_type;
  } else {
    // eslint-disable-next-line no-lonely-if
    if (properties.data) {
      payload.properties.data = base64.encode(properties.data);
      delete payload.properties.config.auth;
      delete payload.properties.config.url;
    }
  }

  return payload;
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generateProviderPatches(originalPayload, updatedPayload, containerValues = {}, mergeContainerProps = []) {
  const { name, description, properties: { config, locations, linked_providers, environment_types, services } } = cloneDeep(originalPayload);
  const model = {
    name,
    description,
    properties: {
      config,
      linked_providers,
      environment_types,
      locations,
      services,
    },
  };

  // TODO: Deal with Patch array issues
  if (updatedPayload.properties.linked_providers !== originalPayload.properties.linked_providers) {
    delete model.properties.linked_providers;
  }

  // TODO: Since we dont want to treat networks JSON as a patch array index
  if (updatedPayload.properties.config.networks !== originalPayload.properties.config.networks) {
    delete model.properties.config.networks;
  }

  // TODO: Since we dont want to treat extra JSON as a patch array index
  if (updatedPayload.properties.config.extra !== originalPayload.properties.config.extra) {
    delete model.properties.config.extra;
  }

  // TODO: Deal with Patch array issues
  if (updatedPayload.properties.services !== originalPayload.properties.services) {
    delete model.properties.services;
  }

  return jsonPatch.compare(model, generateProviderPayload(updatedPayload, mergeContainerProps, containerValues, true));
}

export default {
  generateProviderPayload,
  generateProviderPatches,
};
