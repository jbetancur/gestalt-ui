import {
  ORGANIZATION,
  WORKSPACE,
  ENVIRONMENT,
  PROVIDER,
  LAMBDA,
  CONTAINER,
  API,
  POLICY,
  VOLUME,
  STREAMSPEC,
  SECRET,
  DATAFEED,
  APPDEPLOYMENT,
  USER,
  GROUP,
} from '../../constants';

export function generateRoutePathByTypeId(resource, keyField = 'resource_id') {
  if (!resource.context || !resource.context.fqon) {
    throw new Error('generateRoutePathByTypeId: missing context or context.fqon');
  }

  if (resource.typeId === ORGANIZATION) {
    return `/${context.fqon}/hierachy`;
  }

  if (resource.typeId === WORKSPACE) {
    return `/${context.fqon}/hierachy/${context.workspace}/environments`;
  }

  if (resource.typeId === ENVIRONMENT) {
    return `/${context.fqon}/hierachy/${context.workspace}/environments/${context.environment}`;
  }

  const key = {
    [PROVIDER]: 'providers',
    [LAMBDA]: 'lambdas',
    [CONTAINER]: 'containers',
    [API]: 'apis',
    [POLICY]: 'policies',
    [VOLUME]: 'volumes',
    [STREAMSPEC]: 'streamspecs',
    [SECRET]: 'secrets',
    [DATAFEED]: 'datafeeds',
    [APPDEPLOYMENT]: 'appdeployments',
    [USER]: 'users',
    [GROUP]: 'groups',
  };

  if (context.fqon && context.workspace && context.environment) {
    return `/${context.fqon}/hierachy/${context.workspace}/environment/${context.environment}/${key[resource.typeId]}/${resource[keyField]}`;
  }

  if (context.fqon && context.workspace) {
    return `/${context.fqon}/hierachy/${context.workspace}/${key[resource.typeId]}/${resource[keyField]}`;
  }

  return `/${context.fqon}/${key[resource.typeId]}/${resource[keyField]}`;
}
