import { get } from 'lodash';
import {
  ORGANIZATION,
  WORKSPACE,
  ENVIRONMENT,
} from '../../constants';

/**
 * generateContextEntityState
 * @param {*} params
 */
export function generateContextEntityState(params) {
  const entity = {
    id: params.environmentId || params.workspaceId || null,
    key: null,
  };

  if (params.workspaceId && params.environmentId) {
    entity.key = 'environments';
  }

  if (params.workspaceId && !params.environmentId) {
    entity.key = 'workspaces';
  }

  // if (params.workspaceId && params.environmentId && params.providerId) {
  //   entity.id = params.providerId;
  //   entity.key = 'providers';
  // }

  return entity;
}

export function generateRoutePath(model = {}, resource) {
  const typeId = get(model, 'properties.parent.typeId');

  switch (typeId) {
    case ORGANIZATION:
      return `/${get(model, 'org.properties.fqon')}/${resource}/${model.id}`;
    case WORKSPACE:
      return `/${get(model, 'org.properties.fqon')}/hierachy/${get(model, 'properties.parent.id')}/${resource}/${model.id}`;
    case ENVIRONMENT:
      return `/${get(model, 'org.properties.fqon')}/hierachy/${get(model, 'properties.grandparent.id')}/environment/${get(model, 'properties.parent.id')}/${resource}/${model.id}`;
    default:
      throw new Error('unknown typeId');
  }
}
