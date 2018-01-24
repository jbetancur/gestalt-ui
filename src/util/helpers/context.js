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

  if (params.workspaceId && params.environmentId && params.providerId) {
    entity.id = params.providerId;
    entity.key = 'providers';
  }

  return entity;
}
