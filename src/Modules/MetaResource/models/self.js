import { cloneDeep, merge } from 'lodash';

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
      gestalt_home: {
        org: {
          properties: {},
        },
        created: {},
        modified: {},
        properties: {
          env: {},
        },
      }
    },
  }, safeModel);
};

export default {
  get,
};
