import { isLambdaName, lambdaNamePattern } from 'util/validations';
import { isJSON } from 'validator';

export const nameMaxLen = 45;
export const descriptionMaxLen = 512;

export default (values) => {
  const errors = {
    properties: {
      env: {},
      headers: {},
      provider: {},
      periodic_info: {
        payload: {},
      },
    },
  };

  if (values.properties.provider && !values.properties.provider.id) {
    errors.properties.provider.id = 'a lambda provider type is required';
  }

  if (!values.name) {
    errors.name = 'lambda name is required';
  }

  if (values.name && !isLambdaName(values.name)) {
    errors.name = `invalid lambda name ${lambdaNamePattern}`;
  }

  if (values.name && values.name.length > nameMaxLen) {
    errors.name = 'lambda name is too long';
  }

  if (values.description && values.description.length > descriptionMaxLen) {
    errors.description = 'lambda description is too long';
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

  // if (values.properties.periodic_info &&
  //     values.properties.periodic_info.schedule &&
  //     !isISO8601(values.properties.periodic_info.schedule)) {
  //   errors.properties.periodic_info.schedule = 'must be a valid ISO 8601 format';
  // }

  if (values.properties.periodic_info &&
      values.properties.periodic_info.payload &&
      values.properties.periodic_info.payload.data) {
    // hack to deal with just a "string"" that we want to set on extra, but still treat validation as JSON
    if (!isJSON(values.properties.periodic_info.payload.data)) {
      try {
        JSON.parse(values.properties.periodic_info.payload.data);
      } catch (e) {
        errors.properties.periodic_info.payload.data = 'payload data must be valid JSON';
      }
    }
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
