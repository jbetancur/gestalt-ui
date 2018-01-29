import { isURL } from 'validator';

export const nameMaxLen = 45;

export default (values) => {
  const errors = {
    properties: {
      plugins: {
        rateLimit: {},
        gestaltSecurity: {},
      },
    },
  };

  if (!values.properties.resource) {
    errors.properties.resource = 'a relative path is required';
  }

  if (values.properties.resource && !isURL(values.properties.resource, { require_protocol: false, require_host: false, allow_trailing_dot: false })) {
    errors.properties.resource = 'must be valid url path';
  }

  if (!values.properties.container_port_name) {
    errors.properties.container_port_name = 'select a container port, otherwise, ensure that you created an exposed port mapping';
  }

  if (!values.properties.methods) {
    errors.properties.methods = ' ';
  }

  if (values.properties.plugins.rateLimit && !values.properties.plugins.rateLimit.perMinute) {
    errors.properties.plugins.rateLimit.perMinute = ' ';
  }

  if (values.properties.plugins.rateLimit && (values.properties.plugins.rateLimit.perMinute > 65536 || values.properties.plugins.rateLimit.perMinute === 0)) {
    errors.properties.plugins.rateLimit.perMinute = 'enter a value between 1 and 65536';
  }

  return errors;
};
