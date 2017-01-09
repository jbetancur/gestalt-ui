// sad hack for parsing url

export default function fqonParent(organization) {
  if (organization.org) {
    const urlParser = document.createElement('a');
    urlParser.href = organization.org.href;
    return urlParser.pathname.replace('/', '').split('/')[0];
  }

  return organization;
}
