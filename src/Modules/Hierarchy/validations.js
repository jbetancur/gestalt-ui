import i18next from 'i18next';
import { merge } from 'lodash';
import { nestedObjectFromString } from 'util/helpers/transformations';
import { isFQON, fqonPattern } from 'util/validations';

export const nameMaxLen = 45;
export const shortNameMaxLen = 45;

export default isEnvironment => (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'a short name is required';
  }

  if (values.name && !isFQON(values.name)) {
    errors.name = `only alphanumeric and dashes (-) are allowed: ${fqonPattern}`;
  }

  if (values.name && values.name.length > shortNameMaxLen) {
    errors.name = i18next.t('containment.fields.name.errorText.length');
  }

  if (!values.description) {
    errors.description = 'a name is required';
  }

  if (values.description && values.description.length > nameMaxLen) {
    errors.description = i18next.t('containment.fields.description.errorText.length');
  }

  if (isEnvironment && values.properties && !values.properties.environment_type) {
    merge(errors, nestedObjectFromString('properties.environment_type', 'an environment type is required'));
  }

  return errors;
};
