import { isFQON } from 'util/validations';

export const nameMaxLen = 45;
export const shortNameMaxLen = 30;

export default (values, props) => {
  const errors = {
    properties: {
      environment_type: '',
    }
  };

  let valPatternFunction;
  let errorPattern;

  switch (props.form) {
    case 'organizationCreate':
    case 'organizationEdit':
      valPatternFunction = isFQON;
      errorPattern = 'not a valid short-name pattern';
      break;
    case 'workspaceCreate':
    case 'workspaceEdit':
      valPatternFunction = isFQON;
      errorPattern = 'not a valid short-name pattern';
      break;
    case 'environmentCreate':
    case 'environmentEdit':
      valPatternFunction = isFQON;
      errorPattern = 'not a valid short-name pattern';
      if (values.properties && !values.properties.environment_type) {
        errors.properties.environment_type = 'environment type is required';
      }
      break;
    default:
      valPatternFunction = isFQON;
      errorPattern = 'not an fqon pattern';
      break;
  }

  if (!values.name) {
    errors.name = 'short-name is required';
  } else if (!valPatternFunction(values.name)) {
    errors.name = errorPattern;
  }

  if (values.name && values.name.length > nameMaxLen) {
    errors.name = 'short-name is is too long';
  }

  if (!values.description) {
    errors.description = 'name is required';
  }

  if (values.description && values.description.length > nameMaxLen) {
    errors.description = 'name is is too long';
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
