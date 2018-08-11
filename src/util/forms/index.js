import { isUnixVariable } from 'util/validations';

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const unixPattern =
  (message = 'invalid unix variable') => value => (value && !isUnixVariable(value)) && message;

export const required =
  (message = 'required') => value => (value ? undefined : message);

export const hasSpaces =
  (message = 'spaces not allowed') => value => (value ? value.indexOf(' ') >= 0 : message);

export const lowercase = value => value && value.toLowerCase();

export const fixInputNumber = value => value && parseInt(value, 10);

export const fixInputDecimal = value => value && parseFloat(value.toFixed(1));
