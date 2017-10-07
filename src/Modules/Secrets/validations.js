import { isSecretNameValidation, secretNameValidationPattern } from 'util/validations';

export const nameMaxLen = 30;

export default (values) => {
  const errors = {
    properties: {
      provider: {},
      items: [],
    },
  };


  if (values.properties.provider && !values.properties.provider.id) {
    errors.properties.provider.id = 'a caas provider is required';
  }

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (!isSecretNameValidation(values.name)) {
    errors.name = `allowed format: ${secretNameValidationPattern}`;
  }


  return errors;
};
