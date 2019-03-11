import { object, array, string } from 'yup';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import jsonPatch from 'fast-json-patch';

function transformIn(model) {
  const { properties } = model;

  const newModel = {
    ...model,
    properties: {
      ...properties,
      config: {
        ...properties.config,
      },
    },
  };

  return newModel;
}

function transformOut(model) {
  const { properties } = model;

  const newModel = {
    ...model,
    properties: {
      ...properties,
      config: {
        ...properties.config,
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
      endpoints: array().default([]),
      // gpu_support: object().shape({
      //   enabled: boolean().default(false),
      //   default_type: string().default(''),
      //   types: array()
      //     .of(string())
      //     .default([]),
      // }),
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
    'properties.config.endpoints',
    // 'properties.config.gpu_support',
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
    // 'properties.config.gpu_support',
    'properties.config.endpoints',
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
