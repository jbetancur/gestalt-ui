import { isFQON, isWorkspaceName, isEnvironmentName } from 'util/validations';

export const nameMaxLen = 30;
export const descriptionMaxLen = 1024;

export default (values, props) => {
  const errors = {
    properties: {}
  };

  let valPatternFunction;
  let errorPattern;

  switch (props.form) {
    case 'organizationCreate':
    case 'organizationEdit':
      valPatternFunction = isFQON;
      errorPattern = 'not an fqon pattern';
      break;
    case 'workspaceCreate':
    case 'workspaceEdit':
      valPatternFunction = isWorkspaceName;
      errorPattern = 'not a workspace pattern';
      break;
    case 'environmentCreate':
    case 'environmentEdit':
      valPatternFunction = isEnvironmentName;
      errorPattern = 'not an environment pattern';
      if (values.properties && !values.properties.environment_type) {
        errors.environment_type = 'environment type is required';
      }
      break;
    default:
      valPatternFunction = isFQON;
      errorPattern = 'not an fqon pattern';
      break;
  }

  if (!values.name) {
    errors.name = 'name is required';
  } else if (!valPatternFunction(values.name)) {
    errors.name = errorPattern;
  }

  if (values.name && values.name.length > nameMaxLen) {
    errors.name = 'name is is too long';
  }

  if (values.description && values.description.length > descriptionMaxLen) {
    errors.description = 'description is is too long';
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
