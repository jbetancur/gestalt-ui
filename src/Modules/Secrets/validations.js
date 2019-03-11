import {
  isSecretNameValidation,
  secretNameValidationPattern,
} from 'util/validations';
import merge from 'lodash/merge';
import { nestedObjectFromString } from 'util/helpers/transformations';

export const nameMaxLen = 30;

export default (values) => {
  const errors = {};


  if (!values.name) {
    errors.name = 'name is required';
  }

  if (!isSecretNameValidation(values.name)) {
    errors.name = `allowed format: ${secretNameValidationPattern}`;
  }

  if (values.properties && values.properties.provider && !values.properties.provider.id) {
    merge(errors, nestedObjectFromString('properties.provider.id', 'a caas provider is required'));
  }

  return errors;
};
