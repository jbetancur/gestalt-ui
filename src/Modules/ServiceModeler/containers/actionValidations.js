export default (values) => {
  const errors = {
    properties: {
      provider_def: {
        enpoints: [],
      },
    },
  };

  if (values.properties && values.properties.provider_def) {
    if (!values.properties.provider_def.endpoints || !values.properties.provider_def.endpoints.length) {
      errors.properties.provider_def.endpoints = { _error: 'at least one action is required' };
    } else {
      const actionErrors = [];

      values.properties.provider_def.endpoints.forEach((action, index) => {
        const actionError = {
          implementation: {},
        };

        if (!action || !action.prefix) {
          actionError.prefix = 'required';
          actionErrors[index] = actionError;
        }

        if (!action || (action.implementation && !action.implementation.id)) {
          actionError.implementation.id = 'required';
          actionErrors[index] = actionError;
        }
      });

      if (actionErrors.length) {
        errors.properties.provider_def.endpoints = actionErrors;
      }
    }
  }

  return errors;
};
