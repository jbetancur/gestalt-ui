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
      defined_at: {},
      parent: {},
      actions: [],
      eval_logic: {},
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
    properties: {
      actions: [],
      eval_logic: {},
    }
  }, safeModel), [
    'name',
    'description',
    'properties.actions',
    'properties.eval_logic',
    'properties.lambda',
    'properties.strict',
  ]);
};

export default {
  get,
  create
};
