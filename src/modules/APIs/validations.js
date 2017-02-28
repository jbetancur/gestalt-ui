export const nameMaxLen = 45;

export default (values) => {
  const errors = {
    properties: {}
  };

  if (!values.name) {
    errors.name = 'name is required';
  }

  return errors;
};
