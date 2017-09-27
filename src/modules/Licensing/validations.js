import { isBase64 } from 'util/validations';

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
    errors.properties.data = 'invalid license key - make sure there are no line breaks in your regex';
  }

  return errors;
};
