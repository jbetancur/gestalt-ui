import { cloneDeep, pick, merge } from 'lodash';

const base = {
  org: {
    properties: {},
  },
  created: {},
  modified: {},
};

/**
 * get
 * @param {Object} model - override the model
 */
const get = (model = {}) => {
  const safeModel = cloneDeep(model);

  return merge({
    ...base,
    name: '',
    description: '',
    properties: {
      env: [],
      headers: {
        'Content-Type': 'text/plain',
      },
      code: '',
      code_type: 'package',
      compressed: false,
      cpus: 0.1,
      memory: 128,
      timeout: 60,
      pre_warm: 0,
      handler: '',
      package_url: '',
      public: true,
      runtime: '',
      // Providers is really an array of {id, locations[]}
      provider: {},
      periodic_info: {},
      secrets: [],
      apiendpoints: [],
    }
  }, safeModel);
};

/**
 * create - only allow mutable props
 * @param {Object} model - override the model
 */
const create = (model = {}) => {
  const safeModel = cloneDeep(model);

  return pick(merge({
    properties: {
      env: [],
      headers: {
        'Content-Type': 'text/plain'
      },
      // Providers is really an array of {id, locations[]}
      provider: {},
      periodic_info: {},
      public: true,
      cpus: 0.1,
      memory: 512,
      timeout: 30,
      pre_warm: 0,
      secrets: [],
    }
  }, safeModel), [
    'name',
    'description',
    'properties.env',
    'properties.headers',
    'properties.code',
    'properties.code_type',
    'properties.compressed',
    'properties.cpus',
    'properties.memory',
    'properties.timeout',
    'properties.pre_warm',
    'properties.isolate',
    'properties.handler',
    'properties.package_url',
    'properties.public',
    'properties.runtime',
    'properties.provider',
    'properties.periodic_info',
    'properties.secrets',
    'properties.apiendpoints',
  ]);
};

export default {
  get,
  create
};
