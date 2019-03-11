import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import { mapTo2DArray } from 'util/helpers/transformations';
import workspaceModel from '../models/workspace';
import environmentModel from '../models/environment';

export const selectOrganization = state => state.hierarchy.organization.organization;
export const selectOrganizations = state => state.hierarchy.organizations.organizations;
export const selectAppOrganizations = state => state.hierarchy.allOrganizations.organizations;
export const selectWorkspace = state => state.hierarchy.workspace.workspace;
export const selectWorkspaces = state => state.hierarchy.workspaces.workspaces;
export const selectEnvironment = state => state.hierarchy.environment.environment;
export const selectEnvironments = state => state.hierarchy.environments.environments;
export const selectContext = state => state.hierarchy.context;
// const selectSelf = state => state.hierarchy.self.self;
const selectUserProfile = state => state.userProfile.userProfile.userProfile;

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

export const getHierarchies = createSelector(
  [selectContext, selectUserProfile],
  (context, profile) => context.organizations.concat(context.workspaces)
    .filter(env => !profile.properties.resource_favorites.some(fav => fav.resource_id === env.id))
    .map(env => (Object.assign(env, { $$favorite: false }))),
);

export const getFavoriteHierarchies = createSelector(
  [selectContext, selectUserProfile],
  (context, profile) => context.organizations.concat(context.workspaces)
    .filter(env => profile.properties.resource_favorites.some(fav => fav.resource_id === env.id))
    .map(env => (Object.assign(env, { $$favorite: true }))),
);

export const getEnvironments = createSelector(
  [selectContext, selectUserProfile],
  (context, profile) => context.environments
    .filter(env => !profile.properties.resource_favorites.some(fav => fav.resource_id === env.id))
    .map(env => (Object.assign(env, { $$favorite: false }))),
);

export const getFavoriteEnvironments = createSelector(
  [selectContext, selectUserProfile],
  (context, profile) => context.environments
    .filter(env => profile.properties.resource_favorites.some(fav => fav.resource_id === env.id))
    .map(env => (Object.assign(env, { $$favorite: true }))),
);
