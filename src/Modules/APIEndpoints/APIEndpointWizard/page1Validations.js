export default (values) => {
  const errors = {};

  if (!values.apiId) {
    errors.apiId = 'an api is required';
  }

  return errors;
};
