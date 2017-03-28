import { isContainerName, isCommaDelimited } from 'util/validations';

export const nameMaxLen = 30;

export default (values) => {
  const errors = {
    properties: {
      accepted_resource_roles: '',
      constraints: '',
      provider: {},
    }
  };

  if (values.properties.provider && !values.properties.provider.id) {
    errors.properties.provider.id = 'a provider is required';
  }

  if (!values.name) {
    errors.name = 'container name is required';
  }

  if (values.name && !isContainerName(values.name)) {
    errors.name = 'invalid container name format';
  }

  if (!values.properties.network) {
    errors.properties.network = 'a network is required';
  }

  if (!values.properties.image) {
    errors.properties.image = 'an image is required';
  }

  if (!values.properties.cpus) {
    errors.properties.cpus = 'cpu is required';
  }

  if (!values.properties.memory) {
    errors.properties.memory = 'memory is required';
  }

  if (!values.properties.num_instances) {
    errors.properties.num_instances = 'number of instances is required';
  }

  if (values.properties.accepted_resource_roles && !isCommaDelimited(values.properties.accepted_resource_roles)) {
    errors.properties.accepted_resource_roles = 'Must be a comma delimited list';
  }

  if (values.variables && values.variables.length) {
    const variablesArrayErrors = [];
    values.variables.forEach((variable, variableIndex) => {
      const variableErrors = {};

      if (!variable || !variable.key) {
        variableErrors.key = 'variable name is required';
        variablesArrayErrors[variableIndex] = variableErrors;
      }

      if (!variable || !variable.value) {
        variableErrors.value = 'variable value is required';
        variablesArrayErrors[variableIndex] = variableErrors;
      }

      return variableErrors;
    });

    if (variablesArrayErrors.length) {
      errors.variables = variablesArrayErrors;
    }
  }


  if (values.labels && values.labels.length) {
    const labelsArrayErrors = [];
    values.labels.forEach((label, labelIndex) => {
      const labelErrors = {};

      if (!label || !label.key) {
        labelErrors.key = 'label name is required';
        labelsArrayErrors[labelIndex] = labelErrors;
      }

      if (!label || !label.value) {
        labelErrors.value = 'label value is required';
        labelsArrayErrors[labelIndex] = labelErrors;
      }

      return labelErrors;
    });

    if (labelsArrayErrors.length) {
      errors.labels = labelsArrayErrors;
    }
  }

  return errors;
};
