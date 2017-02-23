export const nameMaxLen = 30;

export default (values) => {
  const errors = {
    properties: {}
  };

  if (!values.name) {
    errors.name = 'name is required';
  }

  return errors;
};
