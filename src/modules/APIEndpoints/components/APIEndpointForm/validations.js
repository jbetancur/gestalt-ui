import { isUUID, isURL } from 'validator';

export const nameMaxLen = 45;

export default (values) => {
  const errors = {
    properties: {
      rateLimit: {},
    },
  };

  if (!values.name) {
    errors.name = ' ';
  }

  if (!values.properties.resource) {
    errors.properties.resource = ' ';
  }

  if (values.properties.resource && !isURL(values.properties.resource, { require_protocol: false, require_host: false, allow_trailing_dot: false })) {
    errors.properties.resource = 'must be valid url path';
  }

  if (!values.properties.implementation_id) {
    errors.properties.implementation_id = ' ';
  }

  if (values.properties.implementation_id && !isUUID(values.properties.implementation_id)) {
    errors.properties.implementation_id = 'must be a valid UUID';
  }

  if (!values.properties.implementation_type) {
    errors.properties.implementation_type = ' ';
  }

  if (!values.properties.container_port_name) {
    errors.properties.container_port_name = 'select a container port name, otherwise, ensure that you created an exposed port mapping';
  }

  if (!values.properties.methods) {
    errors.properties.methods = ' ';
  }

  if (values.properties.rateLimit && !values.properties.rateLimit.perMinute) {
    errors.properties.rateLimit.perMinute = ' ';
  }

  if (values.properties.rateLimit && (values.properties.rateLimit.perMinute > 65536 || values.properties.rateLimit.perMinute === 0)) {
    errors.properties.rateLimit.perMinute = 'enter a value between 1 and 65536';
  }


  // /* eslint-disable dot-notation */
  // if (!values.properties.implementation['function']) {
  //   errors.properties.implementation['function'] = 'function is required';
  // }

  return errors;
};
