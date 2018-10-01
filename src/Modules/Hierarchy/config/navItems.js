
// eslint-disable-next-line no-unused-vars
const navItems = (context, experimentalFlag) => {
  const { contextMeta: { fqon, workspaceId, environmentId } } = context;

  return ({
    organization: [
      {
        key: 'hierarchy--organizations',
        title: 'Hierarchy',
        icon: 'hierarchy',
        to: `/${fqon}/hierarchy`,
      },
      {
        key: 'hierarchy--users',
        title: 'Users',
        icon: 'user',
        to: `/${fqon}/users`,
        isVisible: fqon === 'root',
      },
      {
        key: 'hierarchy--groups',
        title: 'Groups',
        icon: 'group',
        to: `/${fqon}/groups`,
        isVisible: fqon === 'root',
      },
      {
        key: 'hierarchy--resourceTypes',
        icon: 'resourceType',
        title: 'Resource Types',
        to: `/${fqon}/resourcetypes`,
        isVisible: fqon === 'root',
      },
      {
        key: 'hierarchy--providers',
        title: 'Providers',
        icon: 'provider',
        to: `/${fqon}/providers`,
      },
      {
        key: 'hierarchy--mainframe',
        icon: 'cloudframe',
        title: 'Cloud Frame',
        to: 'https://gtw1.test.galacticfog.com/cloud-frame-demo/ui/CloudFrame',
        isVisible: experimentalFlag,
      },
    ],
    workspace: [
      {
        key: 'workspace--environments',
        title: 'Environments',
        icon: 'environment',
        to: `/${fqon}/hierarchy/${workspaceId}/environments`,
      },
      {
        key: 'workspace--providers',
        title: 'Providers',
        icon: 'provider',
        to: `/${fqon}/hierarchy/${workspaceId}/providers`,
      },
    ],
    environment: [
      {
        key: 'environment--containers',
        icon: 'container',
        title: 'Containers',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/containers`,
      },
      {
        key: 'environment--lambdas',
        icon: 'lambda',
        title: 'Lambdas',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/lambdas`,
      },
      {
        key: 'environment--apis',
        icon: 'api',
        title: 'APIs',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/apis`,
      },
      {
        key: 'environment--policies',
        icon: 'policy',
        title: 'Policies',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/policies`,
      },
      {
        key: 'environment--datavolumesfeeds',
        icon: 'volume',
        title: 'Volumes',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/volumes`,
      },
      {
        key: 'environment--secrets',
        icon: 'secret',
        title: 'Secrets',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/secrets`,
      },
      {
        key: 'environment--streams',
        icon: 'stream',
        title: 'Streams',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/streamspecs`,
      },
      {
        key: 'environment--datafeeds',
        icon: 'datafeed',
        title: 'Data Feeds',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/datafeeds`,
      },
      {
        key: 'environment--providers',
        icon: 'provider',
        title: 'Providers',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/providers`,
      },
    ],
  });
};

export default navItems;
