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
      streams: [],
      cpus: 1,
      mem: 512,
      parallelization: 1,
      processor: {
        type: 'map',
        lambda_id: null,
        input_stream_config: {
          name: null,
          feed_id: null,
          partition: {
            partition: 0,
            start_offset: -1,
            end_offset: -1,
          },
        },
        output_stream_config: {
          name: null,
          feed_id: null,
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
      streams: [],
      cpus: 1,
      mem: 512,
      parallelization: 1,
      processor: {
        type: 'map',
        lambda_id: null,
        input_stream_config: {
          name: null,
          feed_id: null,
          partition: {
            partition: 0,
            start_offset: -1,
            end_offset: -1,
          },
        },
        output_stream_config: {
          name: null,
          feed_id: null,
        }
      },
    },
  }, safeModel), [
    'name',
    'description',
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
