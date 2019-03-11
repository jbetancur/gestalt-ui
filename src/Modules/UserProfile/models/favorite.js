import { object, string } from 'yup';
import pick from 'lodash/pick';
import jsonPatch from 'fast-json-patch';

const schema = object().shape({
  resource_id: string(),
  resource_type_id: string(),
  resource_name: string(),
  resource_description: string(),
  nickname: string().default(''),
  context: object().shape({
    org: object().shape({
      id: string(),
      name: string(),
      fqon: string(),
    }),
    workspace: object().shape({
      id: string(),
      name: string(),
    }),
    environment: object().shape({
      id: string(),
      name: string(),
    }),
  }).default({
    org: {},
    workspace: {},
    environment: {}
  }),
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
const patch = (model = {}, updatedModel = {}) => jsonPatch.compare(create(model), create(updatedModel));

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
