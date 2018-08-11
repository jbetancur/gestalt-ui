import { isLambdaName, lambdaNamePattern } from 'util/validations';
import { isJSON } from 'validator';
import { merge } from 'lodash';
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
    // if (values.properties.provider && !values.properties.provider.id) {
    //   merge(errors, nestedObjectFromString('properties.provider.id', 'a lambda provider type is required'));
    // }

    if (!values.properties.runtime) {
      merge(errors, nestedObjectFromString('properties.runtime', 'runtime is required'));
    }

    if (!values.properties.code_type) {
      merge(errors, nestedObjectFromString('properties.code_type', 'code type is required'));
    }

    if (values.properties.code_type === 'package' && !values.properties.package_url) {
      merge(errors, nestedObjectFromString('properties.package_url', 'a package url is required'));
    }

    if (!values.properties.handler) {
      merge(errors, nestedObjectFromString('properties.handler', 'a handler is required'));
    }

    if (!values.properties.cpus) {
      merge(errors, nestedObjectFromString('properties.cpus', 'cpu is required'));
    }

    if (!values.properties.memory) {
      merge(errors, nestedObjectFromString('properties.memory', 'memory is required'));
    }

    if (!values.properties.timeout) {
      merge(errors, nestedObjectFromString('properties.timeout', 'timeout is required'));
    }

    // prevent validation if value is 0
    if (values.properties.pre_warm !== 0 && !values.properties.pre_warm) {
      merge(errors, nestedObjectFromString('properties.pre_warm', 'a value of 0 or greated is required'));
    }

    if (values.properties.pre_warm < 0) {
      merge(errors, nestedObjectFromString('properties.pre_warm', 'cannot be negative'));
    }

    // if (values.properties.periodic_info &&
    //     values.properties.periodic_info.schedule &&
    //     !isISO8601(values.properties.periodic_info.schedule)) {
    //   errors.properties.periodic_info.schedule = 'must be a valid ISO 8601 format';
    // }

    if (values.properties.periodic_info &&
        values.properties.periodic_info.payload &&
        values.properties.periodic_info.payload.data) {
      // hack to deal with just a "string"" that we want to set on extra, but still treat validation as JSON
      if (!isJSON(values.properties.periodic_info.payload.data)) {
        try {
          JSON.parse(values.properties.periodic_info.payload.data);
        } catch (e) {
          merge(errors, nestedObjectFromString('properties.periodic_info.payload.data', 'payload data must be valid JSON'));
        }
      }
    }
  }

  return errors;
};
