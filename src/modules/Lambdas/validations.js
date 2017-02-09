import { isLambdaName } from 'util/validations';

export const nameMaxLen = 30;

export default (values) => {
  const errors = {
    properties: {
      env: {},
      headers: {},
    }
  };

  if (!values.properties.providers) {
    errors.properties.providers = 'a provider is required';
  }

  if (!values.name) {
    errors.name = 'lambda short name is required';
  }

  if (values.name && !isLambdaName(values.name)) {
    errors.name = 'invalid lambda short name format';
  }

  if (values.name && values.name.length > nameMaxLen) {
    errors.name = 'lambda short name is too long';
  }

  if (!values.description) {
    errors.description = 'lambda name is required';
  }

  if (values.description && values.description.length > nameMaxLen) {
    errors.description = 'lambda name is too long';
  }

  if (!values.properties.runtime) {
    errors.properties.runtime = 'runtime is required';
  }

  if (!values.properties.code_type) {
    errors.properties.code_type = 'code type is required';
  }

  if (!values.properties.package_url) {
    errors.properties.package_url = 'a package url is required';
  }

  if (!values.properties.handler) {
    errors.properties.handler = 'a handler is required';
  }

  if (!values.properties.cpus) {
    errors.properties.cpus = 'cpu is required';
  }

  if (!values.properties.memory) {
    errors.properties.memory = 'memory is required';
  }

  if (!values.properties.timeout) {
    errors.properties.timeout = 'timeout is required';
  }

  if (!values.properties.headers.Accept) {
    errors.properties.headers.Accept = 'accept header is required';
  }

  if (values.variables && values.variables.length) {
    const variablesArrayErrors = [];
    values.variables.forEach((member, memberIndex) => {
      const memberErrors = {};

      if (!member || !member.key) {
        memberErrors.key = 'variable name is required';
        variablesArrayErrors[memberIndex] = memberErrors;
      }

      if (!member || !member.value) {
        memberErrors.value = 'variable value is required';
        variablesArrayErrors[memberIndex] = memberErrors;
      }

      return memberErrors;
    });

    if (variablesArrayErrors.length) {
      errors.variables = variablesArrayErrors;
    }
  }

  return errors;
};
