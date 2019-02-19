import { object, array, string } from 'yup';
import { get as getProp, pick, omit } from 'lodash';
import jsonPatch from 'fast-json-patch';
import base64 from 'base-64';
import { mapTo2DArray, arrayToMap } from 'util/helpers/transformations';
import containerModel from '../../Containers/models/container';

const hasContainer = model =>
  !!(getProp(model, 'properties.services[0].container_spec.name')
  && getProp(model, 'properties.services[0].container_spec.properties.provider.id'));

const updateEnv = (model, newEnv, key = 'public') => ({
  ...model,
  properties: {
    ...model.properties,
    config: {
      ...model.properties.config,
      env: {
        ...model.properties.config.env,
        [key]: newEnv
      }
    }
  },
});

function formatData(model) {
  const newModel = {
    ...model,
    properties: {
      ...model.properties,
    }
  };

  if (model.properties.data) {
    newModel.properties.data = base64.encode(newModel.properties.data);
  }

  if (newModel.properties.tempData) {
    newModel.properties.data = base64.encode(newModel.properties.tempData);
  }

  return newModel;
}

function updateContainer(model) {
  const newModel = {
    ...model,
    properties: {
      ...model.properties,
      services: [
        {
          init: { binding: 'eager', singleton: true },
          container_spec: {
            ...model.properties.services[0].container_spec,
            properties: {
              ...model.properties.services[0].container_spec.properties,
              env: Array.isArray(model.properties.services[0].container_spec.properties.env)
                ? arrayToMap(model.properties.services[0].container_spec.properties.env, 'name', 'value')
                : model.properties.services[0].container_spec.properties.env,
              labels: Array.isArray(model.properties.services[0].container_spec.properties.labels)
                ? arrayToMap(model.properties.services[0].container_spec.properties.labels, 'name', 'value')
                : model.properties.services[0].container_spec.properties.labels,
            }
          },
        },
      ],
    },
  };

  return newModel;
}

function transformIn(model) {
  const { properties } = model;
  const newModel = { ...model };

  if (properties.config.env) {
    const publicVar = Array.isArray(properties.config.env.public)
      ? properties.config.env.public
      : mapTo2DArray(properties.config.env.public);

    const privateVar = Array.isArray(properties.config.env.private)
      ? properties.config.env.private
      : mapTo2DArray(properties.config.env.private);

    Object.assign(newModel, updateEnv(newModel, publicVar, 'public'));
    Object.assign(newModel, updateEnv(newModel, privateVar, 'private'));
  }

  return newModel;
}

function transformOut(model) {
  const newModel = { ...model };

  if (newModel.properties.config.env) {
    const publicVar = Array.isArray(newModel.properties.config.env.public)
      ? arrayToMap(newModel.properties.config.env.public, 'name', 'value')
      : newModel.properties.config.env.public;

    const privateVar = Array.isArray(newModel.properties.config.env.private)
      ? arrayToMap(newModel.properties.config.env.private, 'name', 'value')
      : newModel.properties.config.env.private;

    Object.assign(newModel, updateEnv(newModel, publicVar, 'public'));
    Object.assign(newModel, updateEnv(newModel, privateVar, 'private'));
  }

  Object.assign(newModel, formatData(newModel));

  if (hasContainer(model)) {
    Object.assign(newModel, updateContainer(model));
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
      auth: object().default({}),
      storage_classes: array().default([]),
      networks: array().default([]),
      // env: object().shape({}),
    }),
    linked_providers: array().default([]),
    environment_types: array().default([]),
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
const get = (model = {}) => {
  const omitList = [];

  if (!hasContainer(model)) {
    omitList.push('properties.services');
  }

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
    'properties.config',
    'properties.linked_providers',
    'properties.environment_types',
    'properties.data',
    'properties.provider_subtype',
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
  const castedModel = schema.cast(model);

  // force patch on arrays
  const omitList = [
    'properties.linked_providers',
    'properties.services',
  ];

  return jsonPatch.compare(
    omit(create(castedModel), omitList),
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
    'properties.config',
    'properties.linked_providers',
    'properties.environment_types',
    'properties.data',
    'properties.provider_subtype',
    'properties.services',
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
