import { isUnixVariable } from 'util/validations';

// Validators
export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const unixPattern =
  (message = 'invalid unix variable') => value => (value && !isUnixVariable(value)) && message;

export const validator =
  (func, message = 'invalid pattern', options = {}) => value => (value && !func(value, options)) && message;

export const required =
  (message = 'required') => value => (value ? undefined : message);

export const hasSpaces =
  (message = 'spaces not allowed') => value => (value ? value.indexOf(' ') >= 0 : message);

export const min =
  (minNum = 0, message = `must be greater than ${minNum}`) => value => (value < minNum ? message : undefined);

export const max =
  (maxNum = 0, message = `must be less than ${maxNum}`) => value => (value > maxNum ? message : undefined);

export const mod =
  (modNum = 64, message = `must be divisible by ${modNum}`) => value => (value % modNum === 0 ? undefined : message);

export const maxLen =
  (maxNum = 0, message = `must be less than ${maxNum} characters`) => value => (value.length > maxNum ? message : undefined);

// Form Parsers
export const lowercase = value => value && value.toLowerCase();

export const formatName = value => value && value.replace(/[^-\w\s]/gi, '').toLowerCase().substring(0, 32).trim();

export const fixInputNumber = value => value && Number(parseInt(value, 10));

export const fixInputDecimal = value => value && Number(parseFloat(value).toFixed(1));
