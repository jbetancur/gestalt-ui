import { object, array, boolean, string, number } from 'yup';
import { pick } from 'lodash';
import { mapTo2DArray, arrayToMap } from 'util/helpers/transformations';

function transformIn(model) {
  return {
    ...model,
    properties: {
      ...model.properties,
      env: Array.isArray(model.properties.env) ? model.properties.env : mapTo2DArray(model.properties.env),
      labels: Array.isArray(model.properties.labels) ? model.properties.labels : mapTo2DArray(model.properties.labels),
    },
  };
}

function transformOut(model) {
  return {
    ...model,
    properties: {
      ...model.properties,
      env: arrayToMap(model.properties.env, 'name', 'value'),
      labels: arrayToMap(model.properties.labels, 'name', 'value'),
    },
  };
}

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
      properties: object().shape({
        config: object().shape({
          networks: array().default([]),
        }),
      }),
    }).required(),
    network: string().required(),
    cpus: number().default(0.5).required(),
    memory: number().default(128).required(),
    // env: array().default([]), // comment out for now until vars are converted to arrays
    // labels: array().default([]), // comment out for now until vars are converted to arrays
    container_type: string().default('DOCKER').required(),
    accepted_resource_roles: array().default([]),
    constraints: array().default([]),
    instances: array().default([]),
    port_mappings: array().default([]),
    volumes: array().default([]),
    secrets: array().default([]),
    health_checks: array().default([]),
    force_pull: boolean().default(false),
    num_instances: number().default(1),
    apiendpoints: array().default([]),
    status: string(),
    status_detail: string(),
    events: array().default([]),
  }),
});

// const listSchema = array.of(schema);

/**
 * get
 * @param {Object} model
 */
const get = (model = {}) => transformIn(schema.cast(model));

/**
 * create
 * @param {Object} model
 */
const create = (model = {}) =>
  pick(transformOut(get(model)), [
    'name',
    'description',
    'properties.provider',
    'properties.env',
    'properties.labels',
    'properties.port_mappings',
    'properties.volumes',
    'properties.secrets',
    'properties.health_checks',
    'properties.force_pull',
    'properties.container_type',
    'properties.cpus',
    'properties.memory',
    'properties.num_instances',
    'properties.cmd',
    'properties.image',
    'properties.network',
    'properties.user',
    'properties.accepted_resource_roles',
    'properties.constraints',
  ]);

/**
* get
* @param {Object} model
*/
const put = (model = {}) =>
  pick(transformOut(get(model)), [
    'name',
    'description',
    'properties.env',
    'properties.labels',
    'properties.port_mappings',
    'properties.volumes',
    'properties.secrets',
    'properties.health_checks',
    'properties.force_pull',
    'properties.container_type',
    'properties.cpus',
    'properties.memory',
    'properties.num_instances',
    'properties.cmd',
    'properties.image',
    'properties.network',
    'properties.user',
    'properties.accepted_resource_roles',
    'properties.constraints',
  ]);

export default {
  get,
  create,
  put,
  schema,
};
