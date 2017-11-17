/**
 * getParentFQON
 * Extracts the fqon from an meta resource
 * @param {string} - meta resource
 */
export function getParentFQON(organization) {
  const urlParser = document.createElement('a');
  urlParser.href = organization.org.href;

  return urlParser.pathname.replace('/', '').split('/')[0];
}

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

export default {
  getParentFQON,
  getLastFromSplit,
  truncate,
};
