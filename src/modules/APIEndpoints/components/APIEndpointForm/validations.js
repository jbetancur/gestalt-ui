import { isUUID, isURL } from 'validator';

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

  // /* eslint-disable dot-notation */
  // if (!values.properties.implementation['function']) {
  //   errors.properties.implementation['function'] = 'function is required';
  // }

  return errors;
};
