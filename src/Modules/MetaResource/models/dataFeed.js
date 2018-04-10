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
      data: {}
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
      }
    }
  }, safeModel), [
    'id',
    'name',
    'description',
    'properties.kind',
    'properties.data',
  ]);
};

export default {
  get,
  create
};
