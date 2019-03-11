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
    tags: [],
    created: {},
    modified: {},
    name: '',
    description: '',
    extend: '',
    properties: {
      abstract: false,
      api: {
        rest_name: ''
      },
      actions: {
        verbs: [],
      },
      lineage: {
        parent_types: [],
        child_types: []
      }
    },
    property_defs: [],
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
    tags: [],
    created: {},
    modified: {},
    name: '',
    description: '',
    properties: {
      abstract: false,
      api: {
        rest_name: ''
      },
      actions: {
        verbs: [],
      },
      lineage: {
        parent_types: [],
        child_types: []
      }
    },
    property_defs: [],
  }, safeModel), [
    'name',
    'description',
    'extend',
    'tags',
    'properties.abstract',
    'properties.api',
    'properties.actions',
    'properties.lineage',
    'property_defs'
  ]);
};

export default {
  get,
  create,
};
