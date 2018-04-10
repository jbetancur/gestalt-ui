export default (values) => {
  let errors = {};

  if (!values.name) {
    errors.name = 'required';
  }

  if (!values.properties.kind) {
    errors = { ...errors, properties: { kind: 'required' } };
  }

  return errors;
};
