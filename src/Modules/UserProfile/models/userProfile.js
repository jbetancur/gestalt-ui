import { object, array, string } from 'yup';
import { pick } from 'lodash';
import favoriteModel from './favorite';

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
    resource_favorites: array().of(favoriteModel.schema).default([]),
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
    'properties',
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
