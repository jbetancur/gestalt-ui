import { propertyDefValidations } from 'Modules/ResourceTypes/validations';
import { isURL } from 'validator';

export default (values) => {
  const errors = {
    properties: {
      supported_resources: {},
    },
  };

  if (values.properties) {
    if (!values.properties.supported_resources || !values.properties.supported_resources.length) {
      errors.properties.supported_resources = { _error: 'at least one resource is required' };
    } else {
      const resourceErrors = [];

      values.properties.supported_resources.forEach((resource, index) => {
        const resourceError = {
          properties: {
            actions: {},
            api: {},
          }
        };

        if (!resource || !resource.name) {
          resourceError.name = 'required';
          resourceErrors[index] = resourceError;
        }

        if (!resource || (resource.name && resource.name.indexOf(' ') >= 0)) {
          resourceError.name = 'spaces not allowed';
          resourceErrors[index] = resourceError;
        }

        if (!resource || resource.properties) {
          if (resource.properties.actions && !resource.properties.actions.prefix) {
            resourceError.properties.actions.prefix = 'required';
            resourceErrors[index] = resourceError;
          }

          if (resource.properties.api && !resource.properties.api.rest_name) {
            resourceError.properties.api.rest_name = 'required';
            resourceErrors[index] = resourceError;
          }

          if (resource.properties.api && resource.properties.api.rest_name && !isURL(resource.properties.api.rest_name, { require_protocol: false, require_host: false, allow_trailing_dot: false })) {
            resourceError.properties.api.rest_name = 'must be relative url path (e.g. /todos)';
            resourceErrors[index] = resourceError;
          }
        }

        if (!resource || resource.property_defs) {
          const properyDefErrors = propertyDefValidations(resource.property_defs);

          if (properyDefErrors.length) {
            resourceErrors[index] = { ...resourceError, property_defs: properyDefErrors };
          }
        }
      });

      if (resourceErrors.length) {
        errors.properties.supported_resources = resourceErrors;
      }
    }
  }

  return errors;
};
