import { isUUID, isURL } from 'validator';
// import { isAbsolutePath, isURL } from 'util/validations';

export const nameMaxLen = 45;

export default (values) => {
  const errors = {
    properties: {},
  };

  if (!values.name) {
    errors.name = ' ';
  }

  if (!values.properties.resource) {
    errors.properties.resource = ' ';
  }

  if (values.properties.resource && !isURL(values.properties.resource, { require_protocol: false, require_host: false, allow_trailing_dot: false })) {
    errors.properties.resource = 'must be valid URL Path';
  }

  // if (!values.properties.implementation_id) {
  //   errors.properties.implementation_id = 'a lambda UUID is required';
  // }

  if (values.properties.implementation_id && !isUUID(values.properties.implementation_id)) {
    errors.properties.implementation_id = 'must be a valid UUID';
  }

  // /* eslint-disable dot-notation */
  // if (!values.properties.implementation['function']) {
  //   errors.properties.implementation['function'] = 'function is required';
  // }

  return errors;
};
