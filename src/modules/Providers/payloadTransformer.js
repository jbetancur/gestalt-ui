import { cloneDeep } from 'lodash';
import { arrayToMap } from 'util/helpers/transformations';
import base64 from 'base-64';
import { payloadTransformer } from 'modules/Containers';

// import { mapTo2DArray } from 'util/helpers/transformations';
/**
 * generateProviderPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Array} mergeContainerProps
 * @param {Boolean} updateMode
 */
export function generateProviderPayload(sourcePayload, mergeContainerProps = [], containerValues, updateMode = false) {
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
        env: {
          public: arrayToMap(properties.config.env.public, 'name', 'value'),
          private: arrayToMap(properties.config.env.private, 'name', 'value'),
        },
      },
      services: [],
      linked_providers: properties.linked_providers,
      locations: properties.locations,
    }
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

  if (properties.data) {
    payload.properties.data = base64.encode(properties.data);
    delete payload.properties.config.auth;
    delete payload.properties.config.url;
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
    delete payload.properties.services;
  }

  return payload;
}

export default {
  generateProviderPayload,
};
