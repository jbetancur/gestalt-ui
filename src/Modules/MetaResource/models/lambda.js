import { cloneDeep, pick, merge } from 'lodash';

/**
 * get
 * @param {Object} model - override the model
 */
const get = (model = {}) => {
  const safeModel = cloneDeep(model);

  return merge({
    org: {
      properties: {},
    },
    created: {},
    modified: {},
    name: '',
    description: '',
    properties: {
      env: [],
      headers: {
        Accept: 'text/plain'
      },
      code: '',
      code_type: 'package',
      compressed: false,
      cpus: 0.1,
      memory: 512,
      timeout: 30,
      handler: '',
      package_url: '',
      public: true,
      runtime: '',
      // Providers is really an array of {id, locations[]}
      provider: {},
      periodic_info: {},
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
        Accept: 'text/plain'
      },
      // Providers is really an array of {id, locations[]}
      provider: {},
      periodic_info: {},
      public: true,
      cpus: 0.1,
      memory: 512,
      timeout: 30,
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
    'properties.handler',
    'properties.package_url',
    'properties.public',
    'properties.runtime',
    'properties.provider',
    'properties.periodic_info',
    'properties.apiendpoints',
  ]);
};

export default {
  get,
  create
};
