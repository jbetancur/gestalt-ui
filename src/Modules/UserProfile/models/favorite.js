import { object, string } from 'yup';
import { pick } from 'lodash';

const schema = object().shape({
  resource_id: string(),
  resource_type_id: string(),
  resource_name: string(),
  resource_description: string(),
  nickname: string().default(''),
  context: object().shape({
    fqon: string(),
    workspace: string(),
    environmnent: string(),
  }).default({}),
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
  pick(schema.cast(model), [
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
