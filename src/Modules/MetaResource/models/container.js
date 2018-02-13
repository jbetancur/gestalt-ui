import { cloneDeep, pick, merge } from 'lodash';

const get = () => ({
  org: {
    properties: {},
  },
  created: {},
  modified: {},
  properties: {
    env: {},
    labels: {},
    accepted_resource_roles: [],
    constraints: [],
    instances: [],
    port_mappings: [],
    volumes: [],
    secrets: [],
    health_checks: [],
    provider: {},
    force_pull: false,
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
      env: [],
      labels: [],
      accepted_resource_roles: [],
      constraints: [],
      instances: [],
      port_mappings: [],
      volumes: [],
      secrets: [],
      health_checks: [],
      provider: {},
      force_pull: false,
    },
  }, safeModel), [
    'name',
    'description',
    'properties.env',
    'properties.labels',
    'properties.instances',
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
  ]);
};

export default {
  get,
  create
};
