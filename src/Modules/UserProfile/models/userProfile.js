import { object, array, string } from 'yup';
import { pick } from 'lodash';
import jsonPatch from 'fast-json-patch';
import favoriteModel from './favorite';

const schema = object().shape({
  id: string(),
  name: string().default(''),
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
    avatar: string(),
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
    'properties.avatar',
    'properties.resource_favorites',
  ]);

/**
 * patch - only allow mutable props
 * @param {Object} model - override the model
 * @param {Object} updatedModel - override the model
 */
const patch = (model = {}, updatedModel = {}) => (
  jsonPatch.compare(
    create(model),
    create(updatedModel))
);

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
