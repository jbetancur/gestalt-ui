import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';
import { mapTo2DArray } from 'util/helpers/transformations';

export const selectOrganization = state => state.metaResource.organization.organization;
export const selectOrganizations = state => state.metaResource.organizations.organizations;
export const selectWorkspace = state => state.metaResource.workspace.workspace;
export const selectWorkspaces = state => state.metaResource.workspaces.workspaces;
export const selectEnvironment = state => state.metaResource.environment.environment;
export const selectEnvironments = state => state.metaResource.environments.environments;

export const getEditOrganizationModel = createSelector(
  [selectOrganization],
  (organization) => {
    const model = {
      ...organization,
      properties: {
        ...organization.properties,
        env: mapTo2DArray(organization.properties.env),
      }
    };

    return metaModels.workspace.create(model);
  }
);

export const getEditWorkspaceModel = createSelector(
  [selectWorkspace],
  (workspace) => {
    const model = {
      ...workspace,
      properties: {
        ...workspace.properties,
        env: mapTo2DArray(workspace.properties.env),
      }
    };

    return metaModels.workspace.create(model);
  }
);

export const getEditEnvironmentModel = createSelector(
  [selectEnvironment],
  (environment) => {
    const model = {
      ...environment,
      properties: {
        ...environment.properties,
        env: mapTo2DArray(environment.properties.env),
      }
    };

    return metaModels.environment.create(model);
  }
);

