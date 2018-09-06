import { isJSON } from 'validator';
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

    if (properties.config.networks && typeof properties.config.networks === 'string' && !isJSON(properties.config.networks)) {
      merge(errors, nestedObjectFromString('properties.config.networks', 'networks must be valid JSON'));
    }

    if (properties.config && properties.config.extra && typeof properties.config.extra === 'string') {
      // hack to deal with just a "string"" that we want to set on extra, but still treat validation as JSON
      if (!isJSON(properties.config.extra)) {
        try {
          JSON.parse(properties.config.extra);
        } catch (e) {
          merge(errors, nestedObjectFromString('properties.config.extra', 'extra config must be valid JSON'));
        }
      }
    }

    if (hasContainer && values.properties.services && values.properties.services.length && values.properties.services[0].container_spec) {
      const { container_spec } = values.properties.services[0];

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
