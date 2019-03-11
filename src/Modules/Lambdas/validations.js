import { isLambdaName, lambdaNamePattern } from 'util/validations';
import { isJSON } from 'validator';
import merge from 'lodash/merge';
import { nestedObjectFromString } from 'util/helpers/transformations';

export const nameMaxLen = 45;
export const descriptionMaxLen = 512;

export default (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (values.name && !isLambdaName(values.name)) {
    errors.name = `invalid lambda name ${lambdaNamePattern}`;
  }

  if (values.name && values.name.length > nameMaxLen) {
    errors.name = 'name is too long';
  }

  if (values.description && values.description.length > descriptionMaxLen) {
    errors.description = 'description is too long';
  }

  if (values.properties) {
    const { properties } = values;
    // if (values.properties.provider && !values.properties.provider.id) {
    //   merge(errors, nestedObjectFromString('properties.provider.id', 'a lambda provider type is required'));
    // }

    if (!properties.runtime) {
      merge(errors, nestedObjectFromString('properties.runtime', 'runtime is required'));
    }

    if (!properties.code_type) {
      merge(errors, nestedObjectFromString('properties.code_type', 'code type is required'));
    }

    if (properties.code_type === 'package' && !properties.package_url) {
      merge(errors, nestedObjectFromString('properties.package_url', 'a package url is required'));
    }

    if (!properties.handler) {
      merge(errors, nestedObjectFromString('properties.handler', 'a handler is required'));
    }

    if (!properties.timeout) {
      merge(errors, nestedObjectFromString('properties.timeout', 'timeout is required'));
    }

    // prevent validation if value is 0
    if (properties.pre_warm !== 0 && !properties.pre_warm) {
      merge(errors, nestedObjectFromString('properties.pre_warm', 'a value of 0 or greated is required'));
    }

    if (properties.pre_warm < 0) {
      merge(errors, nestedObjectFromString('properties.pre_warm', 'cannot be negative'));
    }

    // if (properties.periodic_info &&
    //     properties.periodic_info.schedule &&
    //     !isISO8601(properties.periodic_info.schedule)) {
    //   errors.properties.periodic_info.schedule = 'must be a valid ISO 8601 format';
    // }

    if (properties.periodic_info &&
        properties.periodic_info.payload &&
        properties.periodic_info.payload.data) {
      // hack to deal with just a "string"" that we want to set on extra, but still treat validation as JSON
      if (!isJSON(properties.periodic_info.payload.data)) {
        try {
          JSON.parse(properties.periodic_info.payload.data);
        } catch (e) {
          merge(errors, nestedObjectFromString('properties.periodic_info.payload.data', 'payload data must be valid JSON'));
        }
      }
    }
  }

  return errors;
};
