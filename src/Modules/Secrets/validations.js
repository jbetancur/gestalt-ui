import {
  isSecretNameValidation,
  secretNameValidationPattern,
  isSecretKeyValidation,
  secretKeyValidationPattern
} from 'util/validations';

export const nameMaxLen = 30;

export default (values, props) => {
  const errors = {
    properties: {
      provider: {},
      items: {},
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

  if (!props.secret.id) {
    if (!values.properties.items || !values.properties.items.length > 0) {
      errors.properties.items = { _error: 'At least one secret must be entered' };
    } else {
      const itemsArrayErrors = [];

      values.properties.items.forEach((item, i) => {
        const itemErrors = {};

        if (!item || !item.key || !isSecretKeyValidation(item)) {
          itemErrors.key = `required: allowed format: ${secretKeyValidationPattern}`;
          itemsArrayErrors[i] = itemErrors;
        }

        if (!item || !item.value) {
          itemErrors.value = ' ';
          itemsArrayErrors[i] = itemErrors;
        }
      });

      if (itemsArrayErrors.length) {
        errors.properties.items = itemsArrayErrors;
      }
    }
  }

  return errors;
};
