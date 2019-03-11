import merge from 'lodash/merge';
import { nestedObjectFromString } from 'util/helpers/transformations';
import {
  isContainerName,
  containerNamePattern,
} from 'util/validations';

export const nameMaxLen = 60;
export const descriptionMaxLen = 512;
export const portMappingServiceNameMaxLen = 15;

export default (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (values.name && !isContainerName(values.name)) {
    errors.name = `invalid container name ${containerNamePattern}`;
  }

  if (values.properties) {
    const { properties } = values;

    if (!properties.network) {
      merge(errors, nestedObjectFromString('properties.network', 'a network required'));
    }

    if (!properties.image) {
      merge(errors, nestedObjectFromString('properties.image', 'an image is required'));
    }

    if (!properties.cpus) {
      merge(errors, nestedObjectFromString('properties.cpus', 'cpus is required'));
    }

    if (!properties.memory) {
      merge(errors, nestedObjectFromString('properties.memory', 'memory is required'));
    }
  }

  return errors;
};
