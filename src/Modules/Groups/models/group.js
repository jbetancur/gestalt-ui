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
    properties: {
      users: [],
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
    org: {
      properties: {},
    },
    created: {},
    modified: {},
    properties: {
      users: [],
    },
  }, safeModel), [
    'name',
    'description',
  ]);
};

export default {
  get,
  create
};
