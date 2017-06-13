import { isEmail } from 'validator';
import { isPhoneNumber, isUsername } from 'util/validations';

export const usernameMaxLen = 20;

export default (values, props) => {
  const errors = {
    properties: {
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gestalt_home: ''
    }
  };

  if (!values.name) {
    errors.name = 'username is required';
  }

  if (values.name && !isUsername(values.name)) {
    errors.name = 'invalid username format';
  }

  if (!values.properties.password && !props.user.id) {
    errors.properties.password = 'password is required';
  }

  if (!values.properties.firstName) {
    errors.properties.firstName = 'first name is required';
  }

  if (!values.properties.lastName) {
    errors.properties.lastName = 'last name is required';
  }

  if (!values.properties.email) {
    errors.properties.email = 'email is required';
  }

  if (values.properties.email && !isEmail(values.properties.email)) {
    errors.properties.email = 'email format is invalid';
  }

  if (!values.properties.phoneNumber) {
    errors.properties.phoneNumber = 'phone number is required';
  }

  if (values.properties.phoneNumber && !isPhoneNumber(values.properties.phoneNumber)) {
    errors.properties.phoneNumber = 'invalid phone number format';
  }

  if (!values.properties.gestalt_home) {
    errors.properties.gestalt_home = 'gestalthome is required';
  }

  if (values.name && values.name.length > usernameMaxLen) {
    errors.name = 'username is is too long';
  }

  return errors;
};
