import { object, array, string } from 'yup';
import { pick } from 'lodash';
import { mapTo2DArray, arrayToMap } from 'util/helpers/transformations';
import containerModel from '../../Containers/models/container';

function transformIn(model) {
  const { properties } = model;
  const newModel = { ...model };

  if (properties.config.env) {
    newModel.properties.config.env = {
      public: Array.isArray(properties.config.env.public) ? properties.config.env.public : mapTo2DArray(properties.config.env.public),
      private: Array.isArray(properties.config.env.private) ? properties.config.env.private : mapTo2DArray(properties.config.env.private),
    };
  }

  return newModel;
}

function transformOut(model, hasContainer) {
  const { properties } = model;
  const newModel = { ...model };

  if (properties.config.env) {
    newModel.properties.config.env = {
      public: arrayToMap(properties.config.env.public, 'name', 'value'),
      private: arrayToMap(properties.config.env.private, 'name', 'value'),
    };
  }

  if (properties.config.url) {
    newModel.properties.config.url = properties.config.url;
  }

  if (properties.config.external_protocol) {
    newModel.properties.config.external_protocol = properties.config.external_protocol;
  }

  if (properties.config.auth) {
    newModel.properties.config.auth = properties.config.auth;
  }

  if (hasContainer) {
    const { container_spec } = newModel.properties.services[0];

    newModel.properties.services[0].container_spec = {
      ...container_spec,
      properties: {
        ...container_spec.properties,
        env: Array.isArray(container_spec.properties.env) ? arrayToMap(container_spec.properties.env, 'name', 'value') : container_spec.properties.env,
        labels: Array.isArray(container_spec.properties.labels) ? arrayToMap(container_spec.properties.labels, 'name', 'value') : container_spec.properties.labels,
      },
    };
  }

  if (!hasContainer && newModel.properties.services) {
    delete newModel.properties.services;
  }

  return newModel;
}

const schema = object().shape({
  id: string(),
  name: string().default('').required(),
  description: string(),
  resource_type: string(),
  resource_state: string(),
  created: object().shape({}),
  modified: object().shape({}),
  owner: object().shape({}),
  org: object().shape({
    properties: object().shape({}),
  }),
  properties: object().shape({
    config: object().shape({
      external_protocol: string().default('https'),
      auth: object().default({}),
      storage_classes: array().default([]),
      networks: array().ensure(),
      env: object().shape({}),
    }),
    linked_providers: array().ensure(),
    environment_types: array().ensure(),
    services: array().default([
      {
        init: { binding: 'eager', singleton: true },
        container_spec: containerModel.create(),
      },
    ]),
    provider_subtype: string(),
    data: string(),
  }),
});

/**
 * get
 * @param {Object} model
 */
const get = (model = {}) => transformIn(schema.cast(model));

/**
 * create
 * @param {Object} model
 */
const create = (model = {}) =>
  pick(transformOut(get(model)), [
    'name',
    'description',
    'resource_type',
    'properties.config',
    'properties.linked_providers',
    'properties.environment_types',
    'properties.data',
    'properties.provider_subtype',
  ]);

/**
 * createWithContainerSpec
 * @param {Object} model
 */
const createWithContainerSpec = (model = {}) =>
  pick(transformOut(get(model), true), [
    'name',
    'description',
    'resource_type',
    'properties.config',
    'properties.linked_providers',
    'properties.services',
    'properties.environment_types',
    'properties.data',
    'properties.provider_subtype',
  ]);

/**
 * patch - only allow mutable props
 * @param {Object} model - override the model
 */
const patch = (model = {}) =>
  pick(transformOut(get(model)), [
    'name',
    'description',
    'properties.config',
    'properties.linked_providers',
    'properties.environment_types',
    'properties.data',
    'properties.provider_subtype',
  ]);

/**
* patchWithContainerSpec - only allow mutable props
* @param {Object} model - override the model
*/
const patchWithContainerSpec = (model = {}) =>
  pick(transformOut(get(model), true), [
    'name',
    'description',
    'properties.config',
    'properties.linked_providers',
    'properties.services',
    'properties.environment_types',
    'properties.data',
    'properties.provider_subtype',
  ]);

/**
 * getForm
 * Format the model specifically for Initializing Forms
 * @param {Object} model
 */
const initForm = (model = {}) => transformIn(get(model));

export default {
  schema,
  get,
  create,
  createWithContainerSpec,
  patch,
  patchWithContainerSpec,
  initForm
};
