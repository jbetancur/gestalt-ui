import { object, string, number } from 'yup';
import pick from 'lodash/pick';

const schema = object().shape({
  id: string(),
  name: string().default('').required(),
  description: string(),
  resource_type: string(),
  resource_state: string(),
  created: object().shape({}),
  modified: object().shape({}),
  owner: object().shape({}),
  org: object().shape({
    properties: object().shape({}),
  }),
  properties: object().shape({
    provider: object().shape({
      id: string().required(),
    }).required(),
    type: string().required().oneOf(['persistent', 'host_path', 'external', 'dynamic']),
    size: number(),
    size_unit: string().oneOf(['GiB', 'MiB']), // this is a ui pseudo prop and is not required by meta
    access_mode: string().required().oneOf(['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany']),
    reclamation_policy: string(),
    external_id: string(),
    config: object().default({}),
    yaml: string(), // This is a psuedo prop and is needed as a place holder for yaml that is to be converted to properties.config. It should be stripped before submitting to meta
    container: object().shape({
      id: string().required(),
    }).required(),
  }),
});

// const listSchema = array.of(schema);

/**
 * get
 * @param {Object} model
 */
const get = (model = {}) => schema.cast(model);

/**
 * get
 * @param {Object} model
 */
const create = (model = {}) =>
  pick(get(model), [
    'name',
    'description',
    'properties.provider',
    'properties.type',
    'properties.size',
    'properties.access_mode',
    'properties.config',
    'properties.size_unit',
    'properties.yaml', // This is a psuedo prop and is needed as a place holder for yaml that is to be converted to properties.config. It should be stripped before submitting to meta
  ]);

/**
 * patch - only allow mutable props
 * @param {Object} model - override the model
 */
const patch = (model = {}) =>
  pick(get(model), [
    'name',
    'description',
    'properties.provider',
    'properties.type',
    'properties.size',
    'properties.access_mode',
    'properties.config',
    'properties.size_unit',
  ]);

/**
 * initForm
 * Format the model specifically for Initializing Forms
 * @param {Object} model
 */
const initForm = (model = {}) => get(model);

export default {
  schema,
  get,
  create,
  patch,
  initForm,
};
