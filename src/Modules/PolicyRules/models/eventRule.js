import { object, array, string } from 'yup';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import jsonPatch from 'fast-json-patch';

function transformIn(model) {
  return model;
}

function transformOut(model) {
  const updatedModel = {
    ...model,
    properties: {
      ...model.properties,
      lambda: model.properties.lambda.id,
    },
  };

  return updatedModel;
}

const schema = object().shape({
  id: string(),
  name: string().default(''),
  description: string(),
  resource_type: string().default('Gestalt::Resource::Rule::Event'),
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
    defined_at: object(),
    match_actions: array().of(object().shape({
      action: string().required(),
      function_method: string().required(),
    })).default([]),
    // TODO: need to make the post for this consistent
    // lambda: object().shape({
    //   id: string(),
    // }),
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
    'properties.lambda',
    'properties.match_actions',
  ]);

/**
 * patch - only allow mutable props
 * @param {Object} model - override the model
 * @param {Object} updatedModel - override the model
 */
const patch = (model = {}, updatedModel = {}) => (
  jsonPatch.compare(
    omit(create(model), ['properties.match_actions']),
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
  'properties.lambda',
  'properties.match_actions',
]);

/**
 * rawGet
 * @param {Object} model
 */
const rawGet = (model = {}) => transformOut(schema.cast(model));

export default {
  schema,
  get,
  create,
  patch,
  initForm,
  rawGet,
};
