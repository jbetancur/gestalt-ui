import { combineReducers } from 'redux';
import reducerFactory from './asyncReducerFactory';
import selfModel from '../models/self';
import organizationModel from '../models/organization';
import organizationSetModel from '../models/organizationSet';
import workspaceModel from '../models/workspace';
import environmentModel from '../models/environment';
import userModel from '../models/user';
import groupModel from '../models/group';
import lambdaModel from '../models/lambda';
import policyModel from '../models/policy';
import policyRuleModel from '../models/policyRule';
import apiModel from '../models/api';
import apiEndpointModel from '../models/apiEndpoint';
import providerModel from '../models/provider';
import containerModel from '../models/container';
import envSchemaModel from '../models/envSchema';

// Bespoke Reducers
import currentOrgContext from './currentOrgContext';
import currentWorkspaceContext from './currentWorkspaceContext';
import currentEnvironmentContext from './currentEnvironmentContext';
import entitlements from './entitlements';
import entitlementSelectedIdentity from './entitlementSelectedIdentity';

export default combineReducers({
  currentOrgContext,
  currentWorkspaceContext,
  currentEnvironmentContext,
  envSchema: reducerFactory(['fetch'], 'schema', 'env_schema', envSchemaModel, true),
  allOrganizations: reducerFactory(['fetch'], 'organizations', 'allorgs', [], true),
  allOrganizationsDropDown: reducerFactory(['fetch'], 'organizations', 'allorgs_dropdown', [], true, [{ name: 'fetching organizations...', value: '' }]),
  organizations: reducerFactory(['fetch'], 'organizations', 'orgs', [], true),
  organization: reducerFactory(['fetch', 'create', 'update', 'delete'], 'organization', 'org', organizationModel, true),
  organizationSet: reducerFactory(['fetch', 'create', 'update', 'delete'], 'organization', 'orgset', organizationSetModel, true),
  workspaces: reducerFactory(['fetch'], 'workspaces', 'workspaces', []),
  workspace: reducerFactory(['fetch', 'create', 'update', 'delete'], 'workspace', 'workspace', workspaceModel, true),
  environments: reducerFactory(['fetch'], 'environments', 'environments', [], true),
  environment: reducerFactory(['fetch', 'create', 'update', 'delete'], 'environment', 'environment', environmentModel, true),
  lambdas: reducerFactory(['fetch', 'delete'], 'lambdas', 'lambdas', [], true),
  lambda: reducerFactory(['fetch', 'create'], 'lambda', 'lambda', lambdaModel, true),
  lambdaUpdate: reducerFactory(['update'], 'lambda', 'lambda', lambdaModel, true),
  lambdaProvider: reducerFactory(['fetch', 'create'], 'provider', 'lambda_provider', providerModel, true),
  lambdasDropDown: reducerFactory(['fetch'], 'lambdas', 'lambdas_dropdown', [], true, [{ id: '', name: 'fetching lambdas...' }]),
  apis: reducerFactory(['fetch', 'delete'], 'apis', 'apis', [], true),
  api: reducerFactory(['fetch', 'create'], 'api', 'api', apiModel, true),
  apiUpdate: reducerFactory(['update'], 'api', 'api', apiModel, true),
  apiEndpoints: reducerFactory(['fetch', 'delete'], 'apiEndpoints', 'apiEndpoints', [], true),
  apiEndpoint: reducerFactory(['fetch', 'create'], 'apiEndpoint', 'apiEndpoint', apiEndpointModel, true),
  apiEndpointUpdate: reducerFactory(['update'], 'apiEndpoint', 'apiEndpoint', apiEndpointModel, true),
  providers: reducerFactory(['fetch', 'delete'], 'providers', 'providers', [], true),
  provider: reducerFactory(['fetch', 'create'], 'provider', 'provider', providerModel, true),
  providerUpdate: reducerFactory(['update'], 'provider', 'provider', providerModel, true),
  providersByType: reducerFactory(['fetch'], 'providers', 'providers_bytype', [], true, [{ id: '', name: 'fetching providers...' }]),
  fetchProviderKongsByGateway: reducerFactory(['fetch'], 'providers', 'providers_kong_gateway', [], true, [{ id: '', name: 'fetching providers...' }]),
  executors: reducerFactory(['fetch'], 'executors', 'executors', [], true, [{ id: '', name: 'fetching executors...' }]),
  containers: reducerFactory(['fetch'], 'containers', 'containers', [], true),
  container: reducerFactory(['fetch', 'create'], 'container', 'container', containerModel, true),
  containersDropDown: reducerFactory(['fetch'], 'containers', 'containers_dropdown', [], true, [{ id: '', name: 'fetching containers...' }]),
  policies: reducerFactory(['fetch', 'delete'], 'policies', 'policies', [], true),
  policy: reducerFactory(['fetch', 'create'], 'policy', 'policy', policyModel, true),
  policyUpdate: reducerFactory(['update'], 'policy', 'policy', policyModel, true),
  policyRules: reducerFactory(['fetch', 'delete'], 'policyRules', 'policyRules', [], true),
  policyRule: reducerFactory(['fetch', 'create'], 'policyRule', 'policyRule', policyRuleModel, true),
  policyRuleUpdate: reducerFactory(['update'], 'policyRule', 'policyRule', policyRuleModel, true),
  entitlements, // TODO: when entitlements is a sensible model
  entitlementUpdate: reducerFactory(['update'], 'entitlement', 'entitlement', {}, true),
  entitlementIdentities: reducerFactory(['fetch'], 'identities', 'identities', [], true),
  entitlementSelectedIdentity,
  users: reducerFactory(['fetch', 'delete'], 'users', 'users', [], true),
  user: reducerFactory(['fetch', 'create'], 'user', 'user', userModel, true),
  userUpdate: reducerFactory(['update'], 'user', 'user', userModel, true),
  groups: reducerFactory(['fetch', 'delete'], 'groups', 'groups', [], true),
  group: reducerFactory(['fetch', 'create'], 'group', 'group', groupModel, true),
  groupUpdate: reducerFactory(['update'], 'group', 'group', groupModel, true),
  groupMembers: reducerFactory(['add', 'remove'], 'group', 'group_member', groupModel, true),
  env: reducerFactory(['fetch'], 'env', 'env', {}),
  self: reducerFactory(['fetch'], 'self', 'self', selfModel),
});
