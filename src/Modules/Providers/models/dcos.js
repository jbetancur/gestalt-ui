import { object, array, string, boolean } from 'yup';
import { pick, omit } from 'lodash';
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
  created: object().shape({}),
  modified: object().shape({}),
  owner: object().shape({}),
  org: object().shape({
    properties: object().shape({}),
  }),
  properties: object().shape({
    config: object().shape({
      url: string(),
      auth: object().default({}),
      external_protocol: string().default('https'),
      accept_any_cert: boolean().default(false),
      appGroupPrefix: string(),
      dcos_cluster_name: string(),
      endpoints: array().default([]),
      haproxyGroup: string(),
      marathon_framework_name: string(),
      networks: array().default([{ name: 'HOST' }, { name: 'BRIDGE' }]),
      secret_store: string(),
      secret_support: boolean().default(false),
      secret_url: string(),
      gpu_support: object().shape({
        enabled: boolean().default(false),
        default_type: string().default(''),
        types: array()
          .of(string())
          .default([]),
      }),
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
    'properties.config.url',
    'properties.config.auth',
    'properties.config.external_protocol',
    'properties.config.accept_any_cert',
    'properties.config.appGroupPrefix',
    'properties.config.endpoints',
    'properties.config.haproxyGroup',
    'properties.config.marathon_framework_name',
    'properties.config.dcos_cluster_name',
    'properties.config.networks',
    'properties.config.secret_store',
    'properties.config.secret_support',
    'properties.config.secret_url',
    'properties.config.gpu_support',
    'properties.linked_providers',
    'properties.environment_types',
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
    'properties.config.url',
    'properties.config.auth',
    'properties.config.external_protocol',
    'properties.config.accept_any_cert',
    'properties.config.appGroupPrefix',
    'properties.config.endpoints',
    'properties.config.haproxyGroup',
    'properties.config.marathon_framework_name',
    'properties.config.dcos_cluster_name',
    'properties.config.networks',
    'properties.config.secret_store',
    'properties.config.secret_support',
    'properties.config.secret_url',
    'properties.config.gpu_support',
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
