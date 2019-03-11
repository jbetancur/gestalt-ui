import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

/**
 * get
 * @param {Object} model - override the model
 */
const get = (model = {}) => {
  const safeModel = cloneDeep(model);

  return merge({
    public: [],
    private: [],
  }, safeModel);
};

export default {
  get,
};
