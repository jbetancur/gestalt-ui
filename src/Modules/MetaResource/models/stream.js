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
      kind: '',
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
    name: '',
    description: '',
    properties: {
      kind: '',
      data: {}
    }
  }, safeModel), [
    'name',
    'description',
  ]);
};

export default {
  get,
  create
};
