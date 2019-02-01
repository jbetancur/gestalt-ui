import { object, string } from 'yup';
import { pick } from 'lodash';

const schema = object().shape({
  resource_id: string().required(),
  nickname: string().default('').required(),
});

/**
 * get
 * @param {Object} model
 */
const get = (model = {}) => schema.cast(model);

/**
 * create - only allow mutable props
 * @param {Object} model - override the model
 */
const create = (model = {}) =>
  pick(get(model), [
    'resource_id',
    'nickname',
  ]);

/**
 * patch - only allow mutable props
 * @param {Object} model - override the model
 */
const patch = (model = {}) => create(model);

/**
 * initForm
 * Format the model specifically for Initializing Forms
 * @param {Object} model
 */
const initForm = (model = {}) => create(model);

export default {
  schema,
  get,
  create,
  patch,
  initForm,
};
