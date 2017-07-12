import i18next from 'i18next';
import { isFQON } from 'util/validations';

export const nameMaxLen = 45;
export const shortNameMaxLen = 25;

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
      errorPattern = i18next.t('containment.fields.name.errorText.pattern');
      break;
    case 'workspaceCreate':
    case 'workspaceEdit':
      valPatternFunction = isFQON;
      errorPattern = i18next.t('containment.fields.name.errorText.pattern');
      break;
    case 'environmentCreate':
    case 'environmentEdit':
      valPatternFunction = isFQON;
      errorPattern = i18next.t('containment.fields.name.errorText.pattern');
      if (values.properties && !values.properties.environment_type) {
        errors.properties.environment_type = ' ';
      }
      break;
    default:
      valPatternFunction = isFQON;
      errorPattern = 'not an fqon pattern';
      break;
  }

  if (!values.name) {
    errors.name = ' ';
  } else if (!valPatternFunction(values.name)) {
    errors.name = errorPattern;
  }

  if (values.name && values.name.length > shortNameMaxLen) {
    errors.name = i18next.t('containment.fields.name.errorText.length');
  }

  if (!values.description) {
    errors.description = ' ';
  }

  if (values.description && values.description.length > nameMaxLen) {
    errors.description = i18next.t('containment.fields.description.errorText.length');
  }

  if (values.variables && values.variables.length) {
    const variablesArrayErrors = [];
    values.variables.forEach((member, memberIndex) => {
      const memberErrors = {};

      if (!member || !member.name) {
        memberErrors.name = 'variable name is required';
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
