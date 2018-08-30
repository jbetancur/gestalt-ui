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
    owner: {},
    name: '',
    description: '',
    properties: {
      environment_types: [],
      config: {
        auth: {},
        external_protocol: 'https',
        env: {
          private: [],
          public: [],
        },
        networks: [],
        storage_classes: [],
      },
      linked_providers: [],
      parent: {},
      services: [],
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
      environment_types: [],
      config: {
        auth: {},
        env: {
          private: [],
          public: [],
        },
        networks: [],
        storage_classes: [],
      },
      linked_providers: [],
      services: [],
    }
  }, safeModel), [
    'name',
    'description',
    'resource_type',
    'properties.config',
    'properties.linked_providers',
    'properties.services',
    'properties.environment_types',
    'properties.storage_classes',
  ]);
};

export default {
  get,
  create
};
