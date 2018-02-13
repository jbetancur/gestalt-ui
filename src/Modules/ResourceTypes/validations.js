export const nameMaxLen = 60;
export const descriptionMaxLen = 512;

export default (values) => {
  const errors = {
    properties: {
      actions: {},
    },
    property_defs: {},
  };

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (values.name && values.name.indexOf(' ') >= 0) {
    errors.name = 'spaces not allowed';
  }

  if (values.name && values.name.length > nameMaxLen) {
    errors.name = `name must be less than ${nameMaxLen} characters`;
  }

  if (values.description && values.description.length > descriptionMaxLen) {
    errors.description = `description must be less than ${descriptionMaxLen} characters`;
  }

  if (!values.extend) {
    errors.extend = 'extend is required';
  }

  if (values.properties && values.properties.actions && !values.properties.actions.prefix) {
    errors.properties.actions.prefix = 'a prefix is required';
  }

  if (values.property_defs && values.property_defs.length) {
    const properyDefErrors = [];
    values.property_defs.forEach((definition, index) => {
      const propertyDefError = {};

      if (!definition || !definition.name) {
        propertyDefError.name = 'required';
        properyDefErrors[index] = propertyDefError;
      }

      if (definition && definition.name && definition.name.indexOf(' ') >= 0) {
        propertyDefError.name = 'spaces not allowed';
        properyDefErrors[index] = propertyDefError;
      }

      if (!definition || !definition.data_type) {
        propertyDefError.data_type = 'required';
        properyDefErrors[index] = propertyDefError;
      }

      if (!definition || !definition.refers_to) {
        propertyDefError.refers_to = 'required';
        properyDefErrors[index] = propertyDefError;
      }
    });

    if (properyDefErrors.length) {
      errors.property_defs = properyDefErrors;
    }
  }

  return errors;
};
