import cloneDeep from 'lodash/cloneDeep';
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
