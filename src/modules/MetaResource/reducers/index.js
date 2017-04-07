import { combineReducers } from 'redux';

import currentOrgContext from './currentOrgContext';
import currentWorkspaceContext from './currentWorkspaceContext';
import currentEnvironmentContext from './currentEnvironmentContext';
import allOrganizations from './allOrganizations';
import allOrganizationsDropDown from './allOrganizationsDropDown';
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
import lambdaProvider from './lambdaProvider';
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
import fetchProviderKongsByGateway from './fetchProviderKongsByGateway';
import executors from './executors';
import containers from './containers';
import container from './container';
import policies from './policies';
import policy from './policy';
import policyUpdate from './policyUpdate';
import policyRules from './policyRules';
import policyRule from './policyRule';
import policyRuleUpdate from './policyRuleUpdate';
import env from './env';
import envSchema from './envSchema';
import entitlements from './entitlements';
import entitlementUpdate from './entitlementUpdate';
import entitlementIdentities from './entitlementIdentities';
import entitlementSelectedIdentity from './entitlementSelectedIdentity';
import users from './users';
import user from './user';
import userUpdate from './userUpdate';
import groups from './groups';
import group from './group';
import groupUpdate from './groupUpdate';
import groupMembers from './groupMembers';
import self from './self';

export default combineReducers({
  currentOrgContext,
  currentWorkspaceContext,
  currentEnvironmentContext,
  allOrganizations,
  allOrganizationsDropDown,
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
  lambdaProvider,
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
  fetchProviderKongsByGateway,
  executors,
  containers,
  container,
  policies,
  policy,
  policyUpdate,
  policyRules,
  policyRule,
  policyRuleUpdate,
  entitlements,
  entitlementUpdate,
  entitlementIdentities,
  entitlementSelectedIdentity,
  users,
  user,
  userUpdate,
  groups,
  group,
  groupUpdate,
  groupMembers,
  env,
  envSchema,
  self,
});
