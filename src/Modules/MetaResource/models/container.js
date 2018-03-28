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
      env: [], // converts to map
      labels: [], // converts to map
      container_type: 'DOCKER',
      accepted_resource_roles: [],
      constraints: [],
      instances: [],
      port_mappings: [],
      volumes: [],
      secrets: [],
      health_checks: [],
      provider: {},
      force_pull: false,
      cpus: 0.1,
      memory: 128,
      num_instances: 1,
      status: '',
      apiendpoints: [],
    }
  }, safeModel);
};

/**
 * create - only allow mutable props
 * @param {Object} model - override the model
 */
const create = (model) => {
  const safeModel = cloneDeep(model);

  return pick(merge({
    properties: {
      env: [], // converts to map
      labels: [], // converts to map
      accepted_resource_roles: [],
      constraints: [],
      instances: [],
      port_mappings: [],
      volumes: [],
      secrets: [],
      health_checks: [],
      provider: {},
      force_pull: false,
      cpus: 0.1,
      memory: 128,
      num_instances: 1,
    }
  }, safeModel), [
    'name',
    'description',
    'properties.env',
    'properties.labels',
    'properties.port_mappings',
    'properties.volumes',
    'properties.secrets',
    'properties.health_checks',
    'properties.provider',
    'properties.force_pull',
    'properties.container_type',
    'properties.cpus',
    'properties.memory',
    'properties.num_instances',
    'properties.cmd',
    'properties.image',
    'properties.network',
    'properties.user',
    'properties.accepted_resource_roles',
    'properties.constraints',
    'properties.apiendpoints',
  ]);
};

export default {
  get,
  create
};
