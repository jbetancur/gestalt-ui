import { map, sortBy, compact } from 'lodash';

export function arrayToMap(array, keyName = 'name', valueName = 'value') {
  return Object.assign({}, ...array.map(v => ({ [v[keyName]]: v[valueName] })));
}

export function mapTo2DArray(object, keyName = 'name', valueName = 'value', mergeSet = {}) {
  const mappedItems = map(object, (value, key) => (Object.assign({ [keyName]: key, [valueName]: value }, mergeSet)));
  return sortBy(mappedItems, [v => v[keyName].toLowerCase()]);
}

export function generateContextEntityState(params) {
  const entity = {
    id: params.environmentId || params.workspaceId || null,
    key: params.workspaceId && params.environmentId ? 'environments' : 'workspaces' || null,
  };

  if (params.workspaceId && params.environmentId && params.providerId) {
    entity.id = params.providerId;
    entity.key = 'providers';
  }

  return entity;
}

export function generateEntityState(params) {
  const entity = {
    id: params.containerId || params.lambdaId || params.environmentId || params.workspaceId || null,
    key: params.workspaceId && params.environmentId ? 'environments' : 'workspaces',
  };

  if (params.lambdaId) {
    entity.key = 'lambdas';
  }

  if (params.containerId) {
    entity.key = 'containers';
  }

  return entity;
}

// convert comma delimited string to an array and remove blank entries
export function stringDemiltedToArray(string) {
  return compact(string.split(','));
}
