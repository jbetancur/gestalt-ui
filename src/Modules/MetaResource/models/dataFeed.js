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
    name: null,
    description: null,
    properties: {
      kind: null,
      data: {},
      credentials: {},
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
    name: null,
    description: null,
    properties: {
      kind: null,
      data: {
        format: null,
        data: null,
        secret: null,
        group: null,
        target: null,
      },
      credentials: {},
    }
  }, safeModel), [
    'name',
    'description',
    'properties.kind',
    'properties.data',
    'properties.credentials',
  ]);
};

export default {
  get,
  create
};
