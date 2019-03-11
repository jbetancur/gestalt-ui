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
      implementation_type: 'lambda',
      resource: '',
      hosts: [],
      implementation_id: '',
      synchronous: true,
      is_http_aware: false,
      methods: ['GET'],
      plugins: {
        rateLimit: {
          enabled: false,
          perMinute: 60,
        },
        gestaltSecurity: {
          enabled: false,
          users: [],
          groups: [],
        },
      },
    },
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
      methods: [],
      hosts: [],
      synchronous: true,
      is_http_aware: false,
      plugins: {
        rateLimit: {},
        gestaltSecurity: {},
      },
    },
  }, safeModel), [
    'name',
    'description',
    'properties.resource',
    'properties.hosts',
    'properties.methods',
    'properties.plugins',
    'properties.synchronous',
    'properties.is_http_aware',
    'properties.implementation_id',
    'properties.implementation_type',
    'properties.container_port_name',
    'properties.provider'
  ]);
};

export default {
  get,
  create
};
