import { cloneDeep, merge } from 'lodash';

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
