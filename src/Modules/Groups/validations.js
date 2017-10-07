export const nameMaxLen = 30;

export default (values) => {
  const errors = {
    properties: {
      users: []
    }
  };

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (values.name && values.name.length > nameMaxLen) {
    errors.name = 'name is is too long';
  }

  return errors;
};
