
// eslint-disable-next-line no-unused-vars
export default (context, experimentalFlag) => {
  const { contextMeta: { fqon, workspaceId, environmentId } } = context;

  return ({
    organization: [
      {
        key: 'orgs-menu--create',
        title: 'Organization',
        icon: 'organization',
        to: { pathname: `/${fqon}/createOrganization`, state: { modal: true } },
      },
      {
        key: 'orgs-menu--workspace-create',
        title: 'Workspace',
        icon: 'workspace',
        to: { pathname: `/${fqon}/createWorkspace`, state: { modal: true } },
      },
      {
        key: 'orgs-menu--provider-create',
        title: 'Provider',
        icon: 'provider',
        to: `/${fqon}/providers/create`,
      },
      {
        key: 'orgs-menu--users-create',
        icon: 'user',
        title: 'User',
        to: `/${fqon}/users/create`,
        isVisible: fqon === 'root',
      },
      {
        key: 'orgs-menu--groups-create',
        title: 'Group',
        icon: 'group',
        to: `/${fqon}/groups/create`,
        isVisible: fqon === 'root',
      },
      {
        key: 'orgs-menu--resourceTypes-create',
        icon: 'resourceType',
        title: 'Resource Type',
        to: `/${fqon}/resourcetypes/create`,
        isVisible: fqon === 'root',
      },
    ],
    workspace: [
      {
        key: 'workspace-menu--environment-create',
        title: 'Environment',
        icon: 'environment',
        to: { pathname: `/${fqon}/hierarchy/${workspaceId}/createEnvironment`, state: { modal: true } },
      },
      {
        key: 'workspace-menu--provider-create',
        title: 'Provider',
        icon: 'provider',
        to: `/${fqon}/hierarchy/${workspaceId}/createProvider`,
      },
    ],
    environment: [
      {
        key: 'environment-menu--container-create"',
        icon: 'container',
        title: 'Container',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/containers/create`,
      },
      {
        key: 'environment-menu--lambda-create',
        icon: 'lambda',
        title: 'Lambda',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/lambdas/create`,
      },
      {
        key: 'environment-menu--api-create',
        icon: 'api',
        title: 'API',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/apis/create`,
      },
      {
        key: 'environment-menu--policy-create',
        icon: 'policy',
        title: 'Policy',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/policies/create`,
      },
      {
        key: 'environment-menu--volume-create',
        icon: 'volume',
        title: 'Volume',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/volumes/create`,
      },
      {
        key: 'environment-menu--secret-create',
        icon: 'secret',
        title: 'Secret',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/secrets/create`,
      },
      {
        key: 'environment-menu--stream-create',
        icon: 'stream',
        title: 'Stream',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/streamspecs/create`,
      },
      {
        key: 'environment-menu--datafeed-create',
        icon: 'datafeed',
        title: 'Data Feed',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/datafeeds/create`,
      },
      {
        key: 'environment-menu--appDeployment',
        icon: 'appDeployment',
        title: 'Application',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/appdeployments/create`,
      },
      {
        key: 'environment-menu--provider-create',
        icon: 'provider',
        title: 'Provider',
        to: `/${fqon}/hierarchy/${workspaceId}/environment/${environmentId}/providers/create`,
      },
    ],
  });
};
