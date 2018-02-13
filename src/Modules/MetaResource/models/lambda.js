import { cloneDeep, pick, merge } from 'lodash';

const get = () => ({
  org: {
    properties: {},
  },
  created: {},
  modified: {},
  properties: {
    env: {},
    headers: {},
    providers: [],
    periodic_info: {
      payload: {},
    },
  },
});

/**
 * create - only allow mutable props
 * @param {Object} model
 */
const create = (model) => {
  const safeModel = cloneDeep(model);
  return pick(merge({
    properties: {
      env: [], // should be converted back to map
      headers: {},
      provider: {},
      periodic_info: {}
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
  ]);
};

export default {
  get,
  create
};
