import { isContainerName, containerNamePattern } from 'util/validations';
import { merge } from 'lodash';
import { nestedObjectFromString } from 'util/helpers/transformations';

export const nameMaxLen = 45;

export default hasContainer => (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (values.name && !isContainerName(values.name)) {
    errors.name = `invalid provider name ${containerNamePattern}`;
  }

  // if (!values.resource_type) {
  //   errors.resource_type = 'provider type is required';
  // }

  if (values.properties) {
    const { properties } = values;

    if (hasContainer && properties.services && properties.services.length && properties.services[0].container_spec) {
      const { container_spec } = properties.services[0];

      if (!container_spec.name) {
        merge(errors, nestedObjectFromString('properties.services[0].container_spec.name', 'name is required'));
      }

      if (container_spec.name && !isContainerName(values.name)) {
        errors.name = `invalid container name ${containerNamePattern}`;
        merge(errors, nestedObjectFromString('properties.services[0].container_spec.name', `invalid container name ${containerNamePattern}`));
      }

      if (!container_spec.properties.network) {
        merge(errors, nestedObjectFromString('properties.services[0].container_spec.properties.network', 'a network required'));
      }

      if (!container_spec.properties.image) {
        merge(errors, nestedObjectFromString('properties.services[0].container_spec.properties.image', 'an image is required'));
      }

      if (!container_spec.properties.cpus) {
        merge(errors, nestedObjectFromString('properties.services[0].container_spec.properties.cpus', 'cpus is required'));
      }

      if (!container_spec.properties.memory) {
        merge(errors, nestedObjectFromString('properties.services[0].container_spec.properties.memory', 'memory is required'));
      }
    }
  }

  return errors;
};
