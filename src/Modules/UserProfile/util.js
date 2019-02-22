import {
  ORGANIZATION,
  WORKSPACE,
  ENVIRONMENT,
  routeKeys,
} from '../../constants';
import favoriteModel from './models/favorite';

export function generateRoutePathByTypeId(favorite, keyField = 'resource_id', typeKeyField = 'resource_type_id') {
  if (!favorite.context.org.fqon) {
    throw new Error('generateRoutePathByTypeId: missing context or context.org.fqon');
  }

  // ensure the model is complete
  const castedFavorite = favoriteModel.get(favorite);
  const { context } = castedFavorite;
  let baseURL = '';

  // generate base URLs
  if (context.workspace.id && context.environment.id) {
    baseURL = `/${context.org.fqon}/hierachy/${context.workspace.id}/environment/${context.environment.id}`;
  } else if (context.workspace.id) {
    baseURL = `/${context.org.fqon}/hierachy/${context.workspace.id}/environments`;
  } else {
    baseURL = `/${context.org.fqon}/hierachy`;
  }

  const isTypeBaseResource =
    favorite[typeKeyField] === ORGANIZATION
    || favorite[typeKeyField] === WORKSPACE
    || favorite[typeKeyField] === ENVIRONMENT;

  if (isTypeBaseResource) {
    return baseURL;
  }

  return `${baseURL}/${routeKeys[favorite[typeKeyField]]}/${favorite[keyField]}`;
}
