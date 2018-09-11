import { object, array, string } from 'yup';
import { pick } from 'lodash';
import base64 from 'base-64';
import { mapTo2DArray, arrayToMap } from 'util/helpers/transformations';
import containerModel from './container';

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

function transformOut(model) {
  const { properties } = model;
  const newModel = { ...model };

  if (properties.config.env) {
    newModel.properties.config.env = {
      public: arrayToMap(properties.config.env.public, 'name', 'value'),
      private: arrayToMap(properties.config.env.private, 'name', 'value'),
    };
  }

  if (properties.data) {
    newModel.properties.data = base64.encode(properties.data);
    delete newModel.properties.config.auth;
    delete newModel.properties.config.url;
  }

  return newModel;
}

const schema = object().shape({
  name: string().required(),
  description: string(),
  resource_type: string().required(),
  org: object().shape({
    properties: object().default({}),
  }),
  owner: object().shape({}),
  created: object().shape({}),
  modified: object().shape({}),
  properties: object().shape({
    config: object().shape({
      external_protocol: string().default('https'),
      auth: object().default({}),
      storage_classes: array().default([]),
      networks: array().default([]),
      env: object().shape({}),
    }),
    linked_providers: array().default([]),
    environment_types: array().default([]),
    services: array().default([
      {
        init: { binding: 'eager', singleton: true },
        container_spec: containerModel.create(),
      },
    ]),
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
  ]);

/**
 * createWithContainerSpec
 * @param {Object} model
 */
const createWithContainerSpec = (model = {}) =>
  pick(transformOut(get(model)), [
    'name',
    'description',
    'resource_type',
    'properties.config',
    'properties.linked_providers',
    'properties.services',
    'properties.environment_types',
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
    'properties.services',
    'properties.environment_types',
  ]);

export default {
  get,
  create,
  createWithContainerSpec,
  patch,
  schema,
};
