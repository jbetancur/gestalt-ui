export const nameMaxLen = 30;

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
    errors.properties.lambda = 'a lambda is required';
  }

  return errors;
};
