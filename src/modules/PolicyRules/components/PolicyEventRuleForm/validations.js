import { isUUID } from 'validator';

export const nameMaxLen = 45;

export default (values) => {
  const errors = {
    properties: {
      lambda: '',
    }
  };

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (!values.properties.lambda) {
    errors.properties.lambda = 'a lambda UUID is required';
  }

  // TODO: temporary until we get better lambda search
  if (typeof values.properties.lambda === 'object') {
    errors.properties.lambda = { id: null };

    if (values.properties.lambda && !isUUID(values.properties.lambda.id)) {
      errors.properties.lambda.id = 'must be a valid UUID';
    }
  } else {
    if (!values.properties.lambda) {
      errors.properties.lambda = 'a lambda UUID is required';
    }

    if (values.properties.lambda && !isUUID(values.properties.lambda)) {
      errors.properties.lambda = 'must be a valid UUID';
    }
  }

  return errors;
};
