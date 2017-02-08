import { isBase64 } from 'validator';

export default (values) => {
  const errors = {
    properties: {
      data: ''
    }
  };

  if (!values.properties.data) {
    errors.properties.data = 'a license key is required';
  }

  if (values.properties.data && !isBase64(values.properties.data)) {
    errors.properties.data = 'invalid license key';
  }

  return errors;
};
