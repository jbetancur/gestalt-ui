import { combineReducers } from 'redux';

import currentOrgContext from './currentOrgContext';
import currentWorkspaceContext from './currentWorkspaceContext';
import currentEnvironmentContext from './currentEnvironmentContext';
import allOrganizations from './allOrganizations';
import organizations from './organizations';
import organization from './organization';
import organizationSet from './organizationSet';
import workspaces from './workspaces';
import workspace from './workspace';
import environments from './environments';
import environment from './environment';
import self from './self';

export default combineReducers({
  currentOrgContext,
  currentWorkspaceContext,
  currentEnvironmentContext,
  allOrganizations,
  organizations,
  organization,
  organizationSet,
  workspaces,
  workspace,
  environments,
  environment,
  self,
});
