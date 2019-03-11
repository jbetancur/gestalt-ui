import merge from 'lodash/merge';
import { nestedObjectFromString } from 'util/helpers/transformations';

export default (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'required';
  }

  if (!values.properties.kind) {
    merge(errors, nestedObjectFromString('properties.kind', 'required'));
  }

  if (!values.properties.data.format) {
    merge(errors, nestedObjectFromString('properties.data.format', 'required'));
  }

  if (!values.properties.data.endpoint) {
    merge(errors, nestedObjectFromString('properties.data.endpoint', 'required'));
  }

  if (!values.properties.data.topic) {
    merge(errors, nestedObjectFromString('properties.data.topic', 'required'));
  }

  return errors;
};
