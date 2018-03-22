export const nameMaxLen = 45;

export default (values) => {
  const errors = {
    properties: {
      eval_logic: {
        operator: '',
        property: '',
        value: null,
      },
    }
  };

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (!values.properties.eval_logic.operator) {
    errors.properties.eval_logic.operator = 'an operator is required';
  }

  if (!values.properties.eval_logic.property) {
    errors.properties.eval_logic.property = 'a limit is required';
  }

  if (!values.properties.eval_logic.value) {
    errors.properties.eval_logic.value = 'a value is required';
  }

  return errors;
};
