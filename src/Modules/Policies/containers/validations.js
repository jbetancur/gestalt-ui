export const nameMaxLen = 30;

export default (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'name is required';
  }

  return errors;
};
