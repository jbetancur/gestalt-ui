import { object, array, string, number } from 'yup';
import { pick } from 'lodash';

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
    parent: object().shape({
      id: string(),
    }),
    // TODO: This needs to be fixed in meta but POST requires a string while GET is an object
    // provider: object().shape({
    //   id: string().required(),
    // }).required(),
    lambda_provider: object().shape({
      url: string().required(),
    }),
    cpus: number().default(0.1).required(),
    mem: number().default(128).required(),
    parallelization: number().default(1).required(),
    processor: object().shape({
      type: string().default('map').required(),
      lambdaId: string().required(),
      inputStreamConfig: object().shape({
        name: string().required(),
        feedID: string().required(),
        partitions: array().required().default([{
          partition: 0,
          startOffset: -1,
          endOffset: -1,
        }]),
        // TODO: partitions future as array
        // partitions: array().of(object().shape({
        //   partition: number().default(0).required(),
        //   startOffset: number().default(-1).required(),
        //   endOffset: number().default(-1).required(),
        // })),
      }),
      outputStreamConfig: object().shape({
        name: string().required(),
        feedID: string().required(),
      }),
    }),
    streams: array().default([]),
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
  pick(get(model), [
    'name',
    'description',
    'properties.lambda_provider',
    'properties.provider',
    'properties.cpus',
    'properties.mem',
    'properties.parallelization',
    'properties.processor',
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
const initForm = (model = {}) => get(model);

export default {
  schema,
  get,
  create,
  patch,
  initForm,
};
