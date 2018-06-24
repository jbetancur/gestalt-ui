import { startCase, toLower } from 'lodash';

/**
 * getLastFromSplit
 * Parses and returns the last item in a structure like GrandPareng::Parent::Child
 * @param {String} string
 */
export function getLastFromSplit(string, delimiter = '::') {
  if (string) {
    const split = string.split(delimiter);

    return split[split.length - 1];
  }
  return string;
}

/**
 * truncate
 * @param {String} string
 * @param {Number} at
 * @param {String} trailing
 */
export function truncate(string, at, trailing = '...') {
  if (string && string.length > at) {
    return `${string.substring(0, at).trim()}${trailing}`;
  }

  return string;
}

/**
 * toTitleCase
 * @param {String} string
 */
export function toTitleCase(string) {
  return startCase(toLower(string));
}


// TODO: Will be rmeoved when we have security config
export const checkIfPassword = field =>
  field && field.length && (field.toUpperCase().includes('PASSWORD') || field.toUpperCase().includes('SECRET') || field.toUpperCase().includes('KEY'));

export default {
  getLastFromSplit,
  truncate,
  toTitleCase,
  checkIfPassword
};

export const removeHostFromURL = (url) => {
  if (url) {
    return url.replace(/^.*\/\/[^/]+:?[0-9]?\//i, '');
  }

  return url;
};
