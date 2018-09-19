import { createSelector } from 'reselect';
import { mapTo2DArray } from 'util/helpers/transformations';
import workspaceModel from './models/workspace';
import environmentModel from './models/environment';

export const selectOrganization = state => state.hierarchy.organization.organization;
export const selectOrganizations = state => state.hierarchy.organizations.organizations;
export const selectWorkspace = state => state.hierarchy.workspace.workspace;
export const selectWorkspaces = state => state.hierarchy.workspaces.workspaces;
export const selectEnvironment = state => state.hierarchy.environment.environment;
export const selectEnvironments = state => state.hierarchy.environments.environments;

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

    return workspaceModel.create(model);
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

    return workspaceModel.create(model);
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

    return environmentModel.create(model);
  }
);
