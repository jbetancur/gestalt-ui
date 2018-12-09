import { createSelector } from 'reselect';
import { sortBy } from 'lodash';
import { mapTo2DArray } from 'util/helpers/transformations';
import workspaceModel from './models/workspace';
import environmentModel from './models/environment';

export const selectOrganization = state => state.hierarchy.organization.organization;
export const selectOrganizations = state => state.hierarchy.organizations.organizations;
export const selectAppOrganizations = state => state.hierarchy.allOrganizations.organizations;
export const selectWorkspace = state => state.hierarchy.workspace.workspace;
export const selectWorkspaces = state => state.hierarchy.workspaces.workspaces;
export const selectEnvironment = state => state.hierarchy.environment.environment;
export const selectEnvironments = state => state.hierarchy.environments.environments;
export const selectContext = state => state.hierarchy.context;
const selectSelf = state => state.hierarchy.self.self;

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

export const getSortedContextOrganizations = createSelector(
  [selectAppOrganizations],
  organizations => sortBy(organizations, ['desciption', 'name'])
);

// export const getSortedContextOrganizations = createSelector(
//   [selectContext],
//   context => sortBy(context.organizations, ['desciption', 'name'])
// );

export const getSortedContextWorkspaces = createSelector(
  [selectContext],
  context => sortBy(context.workspaces, ['desciption', 'name'])
);

export const getSortedContextEnvironments = createSelector(
  [selectContext],
  context => sortBy(context.environments, ['desciption', 'name'])
);

export const getSelfContextEnvironments = createSelector(
  [selectContext, selectSelf],
  (context, self) => sortBy(context.environments, ['desciption', 'name']).filter(env => env.owner.id === self.id),
);
