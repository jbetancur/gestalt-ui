import { object, string, number } from 'yup';
import { pick } from 'lodash';

const schema = object().shape({
  name: string().required(),
  description: string(),
  org: object().shape({
    properties: object().shape({}),
  }),
  created: object().shape({}),
  modified: object().shape({}),
  properties: object().shape({
    provider: object().shape({
      id: string().required(),
    }).required(),
    type: string().required().oneOf(['persistent', 'host_path', 'external', 'dynamic']),
    size: number(),
    size_unit: string().oneOf(['GiB', 'MiB']), // this is a ui temp prop and is not required by meta
    access_mode: string().required().oneOf(['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany']),
    reclamation_policy: string(),
    external_id: string(),
    container_id: string(),
    config: object().default({}),
    yaml: string(),
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
    'properties',
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
    'properties.size_unit',
    'properties.access_mode',
    'properties.mount_path',
    'properties.config',
  ]);

export default {
  get,
  create,
  patch,
  schema,
};
