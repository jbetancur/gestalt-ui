import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import merge from 'lodash/merge';

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
    properties: {
      env: [],
      workspace: {},
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
      env: [],
      workspace: {},
    }
  }, safeModel), [
    'name',
    'description',
    'properties.environment_type',
    'properties.env',
  ]);
};

export default {
  get,
  create
};
