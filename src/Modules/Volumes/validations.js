import { merge } from 'lodash';
import { isURL } from 'validator';
import { nestedObjectFromString } from 'util/helpers/transformations';
import { isYAML } from 'util/validations';

export default (values) => {
  const errors = {};


  if (!values.name) {
    errors.name = 'name is required';
  }

  if (values.properties && values.properties.provider && !values.properties.provider.id) {
    merge(errors, nestedObjectFromString('properties.provider.id', 'a caas provider is required'));
  }

  if (values.properties) {
    const { properties } = values;
    // if (values.properties.provid
    if (!properties.type) {
      merge(errors, nestedObjectFromString('properties.type', 'a volume type is required'));
    }

    if (!properties.size) {
      merge(errors, nestedObjectFromString('properties.size', 'a volume size is required'));
    }

    if (properties.type === 'external' && !properties.yaml) {
      merge(errors, nestedObjectFromString('properties.yaml', 'YAML Config is required'));
    }

    if (properties.type === 'external' && properties.yaml && !isYAML(properties.yaml)) {
      merge(errors, nestedObjectFromString('properties.yaml', 'invalid YAML'));
    }

    if (properties.type === 'host_path' && properties.config && !properties.config.host_path) {
      merge(errors, nestedObjectFromString('properties.config.host_path', 'host path is required'));
    }

    if (properties.type === 'host_path' &&
      properties.config && properties.config.host_path &&
      !isURL(properties.config.host_path, { require_protocol: false, require_host: false, require_valid_protocol: false })) {
      merge(errors, nestedObjectFromString('properties.config.host_path', 'must be an absolute url path'));
    }

    if (properties.type === 'dynamic' && properties.config && !properties.config.storage_class) {
      merge(errors, nestedObjectFromString('properties.config.storage_class', 'a storage class is required'));
    }
  }

  return errors;
};
