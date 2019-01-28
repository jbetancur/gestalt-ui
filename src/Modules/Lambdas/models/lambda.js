import { object, array, boolean, string, number } from 'yup';
import { pick, pull, get as loGet } from 'lodash';
import base64 from 'base-64';
import { isBase64 } from 'util/helpers/strings';
import { mapTo2DArray, arrayToMap } from 'util/helpers/transformations';

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

function transformIn(model) {
  const newModel = { ...model };
  const formatEnv = Array.isArray(newModel.properties.env) ? newModel.properties.env : mapTo2DArray(newModel.properties.env);
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
    parent: object().shape({
      id: string(),
    }),
    provider: object().shape({
      id: string().required(),
      properties: object().shape({
        config: object().shape({
          networks: array().default([]),
        }),
      }),
    }).required(),
    handler: string().required(),
    code_type: string().oneOf(['package', 'code']).default('package'),
    package_url: string(),
    code: string().default(''),
    cpus: number().default(0.1).required(),
    memory: number().default(128).required(),
    timeout: number().default(60).required(),
    pre_warm: number().default(0).required(),
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
    runtime: string().required(),
    secrets: array().default([]),
    apiendpoints: array().default([]),
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

  return pick(transformOut(get(model)), pickList);
};


/**
 * patch - only allow mutable props
 * @param {Object} model - override the model
 */
const patch = (model = {}) => create(model);

/**
 * getForm
 * Format the model specifically for Initializing Forms
 * @param {Object} model
 */
const initForm = (model = {}) => transformIn(get(model));

export default {
  get,
  create,
  patch,
  initForm,
};
