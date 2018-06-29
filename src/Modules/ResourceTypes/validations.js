import { merge } from 'lodash';
import { nestedObjectFromString } from 'util/helpers/transformations';

export const nameMaxLen = 60;
export const descriptionMaxLen = 512;

export default (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (values.name && values.name.indexOf(' ') >= 0) {
    errors.name = 'spaces not allowed';
  }

  if (values.name && values.name.length > nameMaxLen) {
    errors.name = `name must be less than ${nameMaxLen} characters`;
  }

  if (values.description && values.description.length > descriptionMaxLen) {
    errors.description = `description must be less than ${descriptionMaxLen} characters`;
  }

  if (values.properties && values.properties.actions && !values.properties.actions.prefix) {
    merge(errors, nestedObjectFromString('properties.actions.prefix', 'a prefix is required'));
  }

  return errors;
};
