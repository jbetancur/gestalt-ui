import { cloneDeep, pick, merge } from 'lodash';

/**
 * get
 * @param {Object} model - override the model
 */
const get = (model = {}) => {
  const safeModel = cloneDeep(model);

  return merge({
    org: {
      properties: {},
    },
    created: {},
    modified: {},
    name: '',
    description: '',
    properties: {
      provider: null,
      streams: [],
      cpus: 1,
      mem: 512,
      parallelization: 1,
      lambda_provider: {
        url: null,
      },
      processor: {
        type: 'map',
        lambdaId: null,
        inputStreamConfig: {
          name: null,
          feedID: null,
          partitions: [{
            partition: 0,
            startOffset: -1,
            endOffset: -1,
          }],
        },
        outputStreamConfig: {
          name: null,
          feedID: null,
        }
      },
    },
  }, safeModel);
};

/**
 * create - only allow mutable props
 * @param {Object} model - override the model
 */
const create = (model = {}) => {
  const safeModel = cloneDeep(model);

  return pick(merge({
    name: '',
    description: '',
    properties: {
      provider: {},
      streams: [],
      cpus: 1,
      mem: 512,
      parallelization: 1,
      lambda_provider: {
        url: null,
      },
      processor: {
        type: 'map',
        lambdaId: null,
        inputStreamConfig: {
          name: null,
          feedID: null,
          partitions: [{
            partition: 0,
            startOffset: -1,
            endOffset: -1,
          }],
        },
        outputStreamConfig: {
          name: null,
          feedID: null,
        }
      },
    },
  }, safeModel), [
    'name',
    'description',
    'properties.lambda_provider',
    'properties.provider',
    'properties.cpus',
    'properties.mem',
    'properties.parallelization',
    'properties.processor',
  ]);
};

export default {
  get,
  create
};
