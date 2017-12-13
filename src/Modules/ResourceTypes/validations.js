export const nameMaxLen = 30;
export const descriptionMaxLen = 512;

export default (values) => {
  const errors = {
    properties: {
      property_defs: {}
    }
  };

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (!values.extends) {
    errors.extends = 'extends is required';
  }

  if (!values.properties.property_defs || !values.properties.property_defs.length) {
    errors.properties.property_defs = { _error: 'At least one property definition must be entered' };
  } else {
    const properyDefErrors = [];
    values.properties.property_defs.forEach((definition, index) => {
      const propertyDefError = {};
      if (!definition || !definition.name) {
        propertyDefError.name = 'Required';
        properyDefErrors[index] = propertyDefError;
      }
      if (!definition || !definition.data_type) {
        propertyDefError.data_type = 'Required';
        properyDefErrors[index] = propertyDefError;
      }
    });

    if (properyDefErrors.length) {
      errors.properties.property_defs = properyDefErrors;
    }
  }

  return errors;
};
