import { object, array, string } from 'yup';
import { get as getProp, pick, omit } from 'lodash';
import jsonPatch from 'fast-json-patch';
import base64 from 'base-64';
import { mapTo2DArray, arrayToMap } from 'util/helpers/transformations';
import containerModel from '../../Containers/models/container';

const hasContainer = model =>
  !!(getProp(model, 'properties.services[0].container_spec.name')
    && getProp(model, 'properties.services[0].container_spec.properties.provider.id'));

function transformIn(model) {
  const { properties } = model;
  let publicVar = {};
  let privateVar = {};

  if (properties.config.env) {
    publicVar = Array.isArray(properties.config.env.public)
      ? properties.config.env.public
      : mapTo2DArray(properties.config.env.public);

    privateVar = Array.isArray(properties.config.env.private)
      ? properties.config.env.private
      : mapTo2DArray(properties.config.env.private);
  }

  const newModel = {
    ...model,
    properties: {
      ...properties,
      config: {
        ...properties.config,
        env: {
          public: publicVar,
          private: privateVar,
        }
      },
    },
  };

  return newModel;
}

function transformOut(model) {
  const { properties } = model;
  let publicVar = {};
  let privateVar = {};

  if (properties.config.env) {
    publicVar = Array.isArray(properties.config.env.public)
      ? arrayToMap(properties.config.env.public, 'name', 'value')
      : properties.config.env.public;

    privateVar = Array.isArray(properties.config.env.private)
      ? arrayToMap(properties.config.env.private, 'name', 'value')
      : properties.config.env.private;
  }

  const newModel = {
    ...model,
    properties: {
      ...properties,
      config: {
        ...properties.config,
        env: {
          public: publicVar,
          private: privateVar,
        }
      },
    },
  };

  if (properties.data) {
    newModel.properties.data = base64.encode(newModel.properties.data);
  }

  if (properties.tempData) {
    newModel.properties.data = base64.encode(newModel.properties.tempData);
  }

  if (hasContainer(model)) {
    newModel.properties.services = [
      {
        init: { binding: 'eager', singleton: true },
        container_spec: containerModel.create(newModel.properties.services[0].container_spec),
      },
    ];
  }

  return newModel;
}

const schema = object().shape({
  id: string(),
  name: string().default(''),
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
      endpoints: array().default([]),
      // env: object().shape({}),
    }),
    linked_providers: array().default([]),
    environment_types: array().default([]),
    services: array().default([
      {
        init: { binding: 'eager', singleton: true },
        container_spec: containerModel.schema,
      },
    ]),
  }),
});

/**
 * get
 * @param {Object} model
 */
const get = (model = {}) => {
  const omitList = [];

  // if (!hasContainer(model)) {
  //   omitList.push('properties.services');
  // }

  return omit(transformIn(schema.cast(model)), omitList);
};

/**
 * create
 * @param {Object} model
 */
const create = (model = {}) => {
  const pickList = [
    'name',
    'description',
    'resource_type',
    'properties.config.external_protocol',
    'properties.config.env',
    'properties.config.endpoints',
    'properties.linked_providers',
    'properties.environment_types',
  ];

  if (hasContainer(model)) {
    pickList.push('properties.services');
  }

  return pick(transformOut(schema.cast(model)), pickList);
};

/**
 * patch - only allow mutable props
 * @param {Object} model - override the model
 * @param {Object} updatedModel - override the model
 */
const patch = (model = {}, updatedModel = {}) => {
  // force patch on arrays
  const omitList = [
    'properties.linked_providers',
    'properties.services',
  ];

  return jsonPatch.compare(
    omit(create(model), omitList),
    create(updatedModel),
  );
};

/**
 * initForm
 * Format the model specifically for Initializing Forms
 * @param {Object} model
 */
const initForm = (model = {}) => {
  const pickList = [
    'name',
    'description',
    'resource_type',
    'properties.config.external_protocol',
    'properties.config.env',
    'properties.config.endpoints',
    'properties.linked_providers',
    'properties.environment_types',
  ];

  if (hasContainer(model)) {
    pickList.push('properties.services');
  }

  return pick(get(model), pickList);
};

/**
 * rawGet
 * Format the as the original GET
 * @param {Object} model
 */
const rawGet = (model = {}) => {
  const omitList = [];

  if (!hasContainer(model)) {
    omitList.push('properties.services');
  }

  return omit(transformOut(schema.cast(model)), omitList);
};

export default {
  schema,
  get,
  create,
  patch,
  initForm,
  rawGet,
};
