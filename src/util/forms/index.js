import { isUnixVariable } from 'util/validations';

export const getField = (formValues, index) => {
  if (index <= (formValues.length - 1)) {
    return formValues[index];
  }

  return {};
};

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const unixPattern =
  (message = 'invalid unix variable') => value => (value && !isUnixVariable(value)) && message;

export const required =
  (message = 'required') => value => (value ? undefined : message);

export const fixInputNumber = value => value && parseInt(value, 10);
