import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import merge from 'lodash/merge';

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
    properties: {
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gestalt_home: '',
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
    org: {
      properties: {},
    },
    created: {},
    modified: {},
    properties: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gestalt_home: '',
    },
  }, safeModel), [
    'name',
    'description',
    'properties.password',
    'properties.firstName',
    'properties.lastName',
    'properties.email',
    'properties.phoneNumber',
    'properties.gestalt_home',
  ]);
};

export default {
  get,
  create
};
