import { object, array, string, boolean } from 'yup';
import { pick } from 'lodash';
import jsonPatch from 'fast-json-patch';

function transformIn(model) {
  return model;
}

function transformOut(model) {
  return model;
}


const schema = object().shape({
  id: string(),
  name: string().default(''),
  description: string(),
  resource_type: string().default('Gestalt::Resource::Rule::Limit'),
  resource_state: string(),
  created: object().shape({}),
  modified: object().shape({}),
  owner: object().shape({}),
  org: object().shape({
    properties: object().shape({}),
  }),
  properties: object().shape({
    // parent: object().shape({
    //   id: string(),
    // }),
    match_actions: array().default([]),
    // .of(object().shape({
    //   action: string().required(),
    //   function_method: string().required(),
    // }))
    eval_logic: object().shape({
      property: string().required(),
      operator: string().required(),
      value: string().required(),
    }),
    strict: boolean().default(false),
  }),
});

/**
 * get
 * @param {Object} model
 */
const get = (model = {}) => transformIn(schema.cast(model));

/**
 * create - only allow mutable props
 * @param {Object} model - override the model
 */
const create = (model = {}) =>
  pick(transformOut(schema.cast(model)), [
    'name',
    'description',
    'resource_type',
    'properties.eval_logic',
    'properties.match_actions',
    'properties.strict',
  ]);

/**
 * patch - only allow mutable props
 * @param {Object} model - override the model
 * @param {Object} updatedModel - override the model
 */
const patch = (model = {}, updatedModel = {}) => (
  jsonPatch.compare(
    create(model),
    create(updatedModel),
  )
);

/**
 * initForm
 * Format the model specifically for Initializing Forms
 * @param {Object} model
 */
const initForm = (model = {}) => pick(get(model), [
  'name',
  'description',
  'resource_type',
  'properties.eval_logic',
  'properties.match_actions',
  'properties.strict',
]);

export default {
  schema,
  get,
  create,
  patch,
  initForm,
};
