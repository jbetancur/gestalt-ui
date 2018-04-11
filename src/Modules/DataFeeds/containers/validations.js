export default (values) => {
  let errors = {};

  if (!values.name) {
    errors.name = 'required';
  }

  if (!values.properties.kind) {
    errors = { ...errors, properties: { kind: 'required' } };
  }

  if (!values.properties.data.format) {
    errors = { ...errors, properties: { data: { format: 'required' } } };
  }

  if (!values.properties.data.topic) {
    errors = { ...errors, properties: { data: { topic: 'required' } } };
  }

  return errors;
};
