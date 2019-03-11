import merge from 'lodash/merge';
import { nestedObjectFromString } from 'util/helpers/transformations';

import { isEmail } from 'validator';
import { isPhoneNumber, isUsername, usernamePattern, phoneNumberPattern } from 'util/validations';

export const usernameMaxLen = 60;

export default editMode => (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'username is required';
  }

  if (values.name && !(isUsername(values.name) || isEmail(values.name))) {
    errors.name = `format should be ${usernamePattern}`;
  }

  if (values.name && values.name.length > usernameMaxLen) {
    errors.name = 'username is is too long';
  }

  if (values.properties) {
    if (!values.properties.password && !editMode) {
      merge(errors, nestedObjectFromString('properties.password', 'password is required'));
    }

    if (!values.properties.firstName) {
      merge(errors, nestedObjectFromString('properties.firstName', 'first name is required'));
    }

    if (!values.properties.lastName) {
      merge(errors, nestedObjectFromString('properties.lastName', 'last name is required'));
    }

    if (!values.properties.email) {
      merge(errors, nestedObjectFromString('properties.email', 'email is required'));
    }

    if (values.properties.email && !isEmail(values.properties.email)) {
      merge(errors, nestedObjectFromString('properties.email', 'email format is invalid'));
    }

    if (values.properties.phoneNumber && !isPhoneNumber(values.properties.phoneNumber)) {
      merge(errors, nestedObjectFromString('properties.phoneNumber', `format should be ${phoneNumberPattern}`));
    }

    if (!values.properties.gestalt_home) {
      merge(errors, nestedObjectFromString('properties.gestalt_home', 'gestalt home is required'));
    }
  }

  return errors;
};
