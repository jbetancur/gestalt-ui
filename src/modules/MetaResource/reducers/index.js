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
import lambdas from './lambdas';
import lambda from './lambda';
import lambdaUpdate from './lambdaUpdate';
import apis from './apis';
import api from './api';
import apiUpdate from './apiUpdate';
import apiEndpoints from './apiEndpoints';
import apiEndpoint from './apiEndpoint';
import apiEndpointUpdate from './apiEndpointUpdate';
import providers from './providers';
import provider from './provider';
import providerUpdate from './providerUpdate';
import providersByType from './providersByType';
import executors from './executors';
import containers from './containers';
import container from './container';
import env from './env';
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
  lambdas,
  lambda,
  lambdaUpdate,
  apis,
  api,
  apiUpdate,
  apiEndpoints,
  apiEndpoint,
  apiEndpointUpdate,
  providers,
  provider,
  providerUpdate,
  providersByType,
  executors,
  containers,
  container,
  env,
  self,
});
