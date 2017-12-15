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

  if (!values.extend) {
    errors.extend = 'extend is required';
  }

  if (values.properties.actions.verbs.length && !values.properties.actions.prefix) {
    errors.properties.actions.prefix = 'a prefix is required when specifying actions';
  }

  if (values.property_defs && values.property_defs.length) {
    const properyDefErrors = [];
    values.property_defs.forEach((definition, index) => {
      const propertyDefError = {};

      if (!definition || !definition.name) {
        propertyDefError.name = 'required';
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
