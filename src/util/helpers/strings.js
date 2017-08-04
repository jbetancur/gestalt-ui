// sad hack for parsing url

/**
 * Extracts the fqon from an meta resource
 * @param {string} - meta resource
 */
export function getParentFQON(organization) {
  if (organization.org) {
    const urlParser = document.createElement('a');
    urlParser.href = organization.org.href;
    return urlParser.pathname.replace('/', '').split('/')[0];
  }

  return organization;
}

/**
 * Parses and returns the last item in a structure like GrandPareng::Parent::Child
 * @param {String} string
 */
export function parseChildClass(string) {
  if (string) {
    const split = string.split('::');
    return split[split.length - 1];
  }

  return string;
}

/**
 *
 * @param {String} string
 * @param {Number} at
 * @param {String} trailing
 */
export function truncate(string, at, trailing = '...') {
  if (string && string.length > at) {
    return `${string.substring(0, at)}${trailing}`;
  }

  return string;
}

export default {
  getParentFQON,
  parseChildClass,
  truncate,
};
