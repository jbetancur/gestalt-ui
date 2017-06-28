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
 * @param {string} state
 */
export function parseChildClass(state) {
  const split = state.split('::');
  return split[split.length - 1];
}

export default {
  getParentFQON,
  parseChildClass,
};
