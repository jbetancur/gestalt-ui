import { isUUID, isURL } from 'validator';
import { merge } from 'lodash';
import { nestedObjectFromString } from 'util/helpers/transformations';

export const nameMaxLen = 45;

export default (values) => {
  const errors = {};

  if (values && values.properties) {
    if (!values.properties.resource && !values.properties.hosts.length) {
      merge(errors, nestedObjectFromString('properties.resource', 'a relative path is required if no hosts are specified'));
      merge(errors, nestedObjectFromString('properties.hosts', 'at least 1 host or a relative path is required'));
    }

    if (values.properties.resource && !isURL(values.properties.resource, { require_protocol: false, require_host: false, allow_trailing_dot: false })) {
      merge(errors, nestedObjectFromString('properties.resource', 'must be valid url path'));
    }

    if (!values.properties.implementation_id) {
      merge(errors, nestedObjectFromString('properties.implementation_id', 'an implementation is required'));
    }

    if (values.properties.implementation_id && !isUUID(values.properties.implementation_id)) {
      merge(errors, nestedObjectFromString('properties.implementation_id', 'must be a valid UUID'));
    }

    if (!values.properties.implementation_type) {
      merge(errors, nestedObjectFromString('properties.implementation_type', ' '));
    }

    if (values.properties.implementation_type === 'container' && !values.properties.container_port_name) {
      merge(errors, nestedObjectFromString('properties.container_port_name', 'select a service label, otherwise, ensure that you created an exposed service port mapping'));
    }

    if (!values.properties.methods) {
      merge(errors, nestedObjectFromString('properties.methods', ' '));
    }

    if (values.properties.plugins.rateLimit && !values.properties.plugins.rateLimit.perMinute) {
      merge(errors, nestedObjectFromString('properties.plugins.rateLimit.perMinute', ' '));
    }

    if (values.properties.plugins.rateLimit && (values.properties.plugins.rateLimit.perMinute > 65536 || values.properties.plugins.rateLimit.perMinute === 0)) {
      merge(errors, nestedObjectFromString('properties.plugins.rateLimit.perMinute', 'enter a value between 1 and 65536'));
    }
  }

  return errors;
};
