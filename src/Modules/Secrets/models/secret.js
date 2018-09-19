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
      provider: {},
      items: [],
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
    org: {
      properties: {},
    },
    created: {},
    modified: {},
    properties: {
      provider: {},
      items: [],
    }
  }, safeModel), [
    'name',
    'description',
    'properties.provider',
    'properties.items',
  ]);
};

export default {
  get,
  create
};
