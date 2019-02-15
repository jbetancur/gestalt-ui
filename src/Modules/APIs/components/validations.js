import { isContainerName } from 'util/validations';
import { merge } from 'lodash';
import { nestedObjectFromString } from 'util/helpers/transformations';


export const nameMaxLen = 45;

export default (values) => {
  const errors = {};


  if (values.properties && values.properties.provider && !values.properties.provider.locations) {
    merge(errors, nestedObjectFromString('properties.provider.locations', 'a kong provider type is required'));
  }

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (values.name && !isContainerName(values.name)) {
    errors.name = 'invalid api name format';
  }

  if (values.name && values.name.length > nameMaxLen) {
    errors.name = `api name cannot be longer than ${nameMaxLen} characters`;
  }

  return errors;
};
