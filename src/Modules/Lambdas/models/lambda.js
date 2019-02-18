import { object, array, boolean, string, number } from 'yup';
import { pick, pull, omit, get as loGet } from 'lodash';
import base64 from 'base-64';
import { isBase64 } from 'util/helpers/strings';
import { arrayToMap, convertFromMaps } from 'util/helpers/transformations';
import jsonPatch from 'fast-json-patch';

const updateEnv = (model, newEnv) => ({
  ...model,
  properties: {
    ...model.properties,
    env: newEnv,
  },
});

const updateCode = (model, newCode) => ({
  ...model,
  properties: {
    ...model.properties,
    code: newCode,
  },
});

const updatePeriodicPayloadData = (model, newData) => ({
  ...model,
  properties: {
    ...model.properties,
    periodic_info: {
      ...model.properties.periodic_info,
      payload: {
        ...model.properties.periodic_info.payload,
        data: newData,
      },
    },
  },
});

function transformIn(model, envToMerge) {
  const newModel = { ...model };
  const formatEnv = Array.isArray(model.properties.env)
    ? model.properties.env
    : convertFromMaps(model.properties.env, envToMerge);

  Object.assign(newModel, updateEnv(newModel, formatEnv));

  // do not encode if already encoded
  if (loGet(newModel, 'properties.code') && loGet(newModel, 'properties.code_type') === 'code' && isBase64(newModel.properties.code)) {
    Object.assign(newModel, updateCode(newModel, base64.decode(newModel.properties.code)));
  }

  if (loGet(newModel, 'properties.periodic_info.payload.data') && isBase64(newModel.properties.periodic_info.payload.data)) {
    Object.assign(newModel, updatePeriodicPayloadData(newModel, base64.decode(newModel.properties.periodic_info.payload.data)));
  }

  return newModel;
}

function transformOut(model) {
  const newModel = { ...model };
  const formatEnv = arrayToMap(newModel.properties.env, 'name', 'value');

  Object.assign(newModel, updateEnv(newModel, formatEnv));

  // Clean up properties depending on lambda code_type
  if (loGet(newModel, 'properties.code') && newModel.properties.code_type === 'code') {
    Object.assign(newModel, updateCode(newModel, base64.encode(newModel.properties.code)));
  }

  if (loGet(newModel, 'properties.periodic_info.payload.data')) {
    Object.assign(newModel, updatePeriodicPayloadData(newModel, base64.encode(newModel.properties.periodic_info.payload.data)));
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
    parent: object().shape({
      id: string(),
    }),
    provider: object().shape({
      id: string(),
      properties: object().shape({
        config: object().shape({
          networks: array().default([]),
        }),
      }),
    }),
    handler: string(),
    code_type: string().oneOf(['package', 'code']).default('package'),
    package_url: string(),
    code: string().default(''),
    cpus: number().default(0.1),
    memory: number().default(128),
    timeout: number().default(60),
    pre_warm: number().default(0),
    public: boolean().default(true),
    compressed: boolean().default(false),
    isolate: boolean().default(false),
    // env: array().default([]), // comment out for now until vars are converted to arrays
    headers: object().default({
      'Content-Type': 'text/plain',
    }),
    periodic_info: object().shape({
      schedule: string().default(''),
      timezone: string().default(''),
      payload: object().shape({
        eventName: string().default(''),
        data: string().default(''),
      }),
    }),
    runtime: string(),
    secrets: array().default([]),
    apiendpoints: array().default([]),
  }),
});

/**
 * get
 * @param {Object} model
 */
const get = (model = {}, envToMerge = {}) => transformIn(schema.cast(model), envToMerge);

/**
 * create
 * @param {Object} model
 */
const create = (model = {}) => {
  const pickList = [
    'name',
    'description',
    'properties.env',
    'properties.headers',
    'properties.code',
    'properties.code_type',
    'properties.compressed',
    'properties.isolate',
    'properties.cpus',
    'properties.memory',
    'properties.timeout',
    'properties.pre_warm',
    'properties.handler',
    'properties.package_url',
    'properties.public',
    'properties.runtime',
    'properties.periodic_info.schedule',
    'properties.periodic_info.timezone',
    'properties.periodic_info.payload',
    'properties.secrets',
    'properties.provider.id',
    'properties.provider.name',
    'properties.provider.resource_type',
  ];

  if (model.properties.code_type === 'package') {
    pull(pickList, 'properties.code');
  } else {
    pull(pickList, 'properties.package_url', 'properties.compressed');
  }

  if (!model.properties.periodic_info.schedule) {
    pull(pickList, 'properties.periodic_info.timezone', 'properties.periodic_info.payload');
  }

  return pick(transformOut(schema.cast(model)), pickList);
};


/**
 * patch - only allow mutable props
 * @param {Object} model - override the model
 * @param {Object} updatedModel - override the model
 */
const patch = (model = {}, updatedModel = {}) => (
  // omit secrets is used to deal with json pointer for patch arrays
  jsonPatch.compare(
    omit(create(model), ['properties.secrets']),
    create(updatedModel),
  )
);

/**
 * initForm
 * Format the model specifically for Initializing Forms
 * @param {Object} model
 */
const initForm = (model = {}) => {
  const pickList = [
    'name',
    'description',
    'properties.env',
    'properties.headers',
    'properties.code',
    'properties.code_type',
    'properties.compressed',
    'properties.isolate',
    'properties.cpus',
    'properties.memory',
    'properties.timeout',
    'properties.pre_warm',
    'properties.handler',
    'properties.package_url',
    'properties.public',
    'properties.runtime',
    'properties.periodic_info.schedule',
    'properties.periodic_info.timezone',
    'properties.periodic_info.payload',
    'properties.secrets',
    'properties.provider.id',
    'properties.provider.name',
    'properties.provider.resource_type',
  ];

  return pick(get(model), pickList);
};

export default {
  schema,
  get,
  create,
  patch,
  initForm,
};
