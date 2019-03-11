import { object, array, string } from 'yup';
import { pick, omit } from 'lodash';
import jsonPatch from 'fast-json-patch';
import { mapTo2DArray, arrayToMap } from 'util/helpers/transformations';

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

  return newModel;
}

const schema = object().shape({
  id: string(),
  name: string().default(''),
  description: string(),
  resource_type: string(),
  resource_state: string(),
  created: object().shape({}).default({}),
  modified: object().shape({}).default({}),
  owner: object().shape({}).default({}),
  org: object().shape({
    properties: object().shape({}).default({}),
  }),
  properties: object().shape({
    config: object().shape({
      external_protocol: string().default('https'),
      // env: object().shape({}),
    }),
    linked_providers: array().default([]),
    environment_types: array().default([]),
  }),
});

/**
 * get
 * @param {Object} model
 */
const get = (model = {}) => {
  const omitList = [];

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
    'properties.linked_providers',
    'properties.environment_types',
    'properties.provider_subtype',
  ];

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
    'properties.linked_providers',
    'properties.environment_types',
  ];

  return pick(get(model), pickList);
};

/**
 * rawGet
 * Format the as the original GET
 * @param {Object} model
 */
const rawGet = (model = {}) => {
  const omitList = [];

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
