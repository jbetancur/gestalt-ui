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
import secretModel from '../models/secret';
import resourceTypeModel from '../models/resourceType';

export default combineReducers({
  envSchema: reducerFactory(['fetch'], 'schema', 'env_schema', envSchemaModel, true),
  allOrganizations: reducerFactory(['fetch'], 'organizations', 'allorgs', []),
  allOrganizationsDropDown: reducerFactory(['fetch'], 'organizations', 'allorgs_dropdown', []),
  organizations: reducerFactory(['fetch'], 'organizations', 'orgs', []),
  organization: reducerFactory(['fetch', 'create', 'update', 'delete'], 'organization', 'org', organizationModel, true),
  organizationSet: reducerFactory(['fetch', 'create', 'update', 'delete'], 'organization', 'orgset', organizationSetModel),
  workspaces: reducerFactory(['fetch'], 'workspaces', 'workspaces', []),
  workspace: reducerFactory(['fetch', 'create', 'update', 'delete'], 'workspace', 'workspace', workspaceModel, true),
  environments: reducerFactory(['fetch'], 'environments', 'environments', []),
  environment: reducerFactory(['fetch', 'create', 'update', 'delete'], 'environment', 'environment', environmentModel, true),
  lambdas: reducerFactory(['fetch', 'delete'], 'lambdas', 'lambdas', [], true),
  lambda: reducerFactory(['fetch', 'create', 'update'], 'lambda', 'lambda', lambdaModel, true),
  lambdaProvider: reducerFactory(['fetch', 'create'], 'provider', 'lambda_provider', providerModel, true),
  lambdasDropDown: reducerFactory(['fetch'], 'lambdas', 'lambdas_dropdown', [], true, []),
  apis: reducerFactory(['fetch', 'delete'], 'apis', 'apis', [], true),
  api: reducerFactory(['fetch', 'create', 'update'], 'api', 'api', apiModel, true),
  apiEndpoints: reducerFactory(['fetch', 'delete'], 'apiEndpoints', 'apiEndpoints', [], true),
  apiEndpoint: reducerFactory(['fetch', 'create'], 'apiEndpoint', 'apiEndpoint', apiEndpointModel, true),
  apiEndpointUpdate: reducerFactory(['update'], 'apiEndpoint', 'apiEndpoint', apiEndpointModel, true),
  providers: reducerFactory(['fetch', 'delete'], 'providers', 'providers', []),
  provider: reducerFactory(['fetch', 'create'], 'provider', 'provider', providerModel, true),
  providerUpdate: reducerFactory(['update'], 'provider', 'provider', providerModel, true),
  providersByType: reducerFactory(['fetch'], 'providers', 'providers_bytype', [], true, []),
  fetchProviderKongsByGateway: reducerFactory(['fetch'], 'providers', 'providers_kong_gateway', [], true, []),
  executors: reducerFactory(['fetch'], 'executors', 'executors', [], true, []),
  containers: reducerFactory(['fetch'], 'containers', 'containers', [], true),
  container: reducerFactory(['fetch', 'create'], 'container', 'container', containerModel, true),
  containerUpdate: reducerFactory(['update'], 'container', 'container', containerModel, true),
  containersDropDown: reducerFactory(['fetch'], 'containers', 'containers_dropdown', [], true, []),
  policies: reducerFactory(['fetch', 'delete'], 'policies', 'policies', [], true),
  policy: reducerFactory(['fetch', 'create', 'update'], 'policy', 'policy', policyModel, true),
  policyRules: reducerFactory(['fetch', 'delete'], 'policyRules', 'policyRules', [], true),
  policyRule: reducerFactory(['fetch', 'create', 'update'], 'policyRule', 'policyRule', policyRuleModel, true),
  entitlements: reducerFactory(['fetch'], 'entitlements', 'entitlements', [], true),
  entitlementUpdate: reducerFactory(['update'], 'entitlement', 'entitlement', {}, true),
  entitlementIdentities: reducerFactory(['fetch'], 'identities', 'identities', []),
  users: reducerFactory(['fetch', 'delete'], 'users', 'users', []),
  user: reducerFactory(['fetch', 'create'], 'user', 'user', userModel, true),
  userUpdate: reducerFactory(['update'], 'user', 'user', userModel, true),
  groups: reducerFactory(['fetch', 'delete'], 'groups', 'groups', []),
  // TODO: updated for group is required due to the way group memebers are patched
  group: reducerFactory(['fetch', 'create', 'update'], 'group', 'group', groupModel, true),
  // TODO: this will not be needed once the group end point no longer requires patching memebers
  groupUpdate: reducerFactory(['update'], 'group', 'group', groupModel, true),
  groupMembers: reducerFactory(['add', 'remove'], 'group', 'group_member', groupModel, true),
  env: reducerFactory(['fetch'], 'env', 'env', {}),
  self: reducerFactory(['fetch'], 'self', 'self', selfModel),
  logProvider: reducerFactory(['fetch'], 'logProvider', 'logprovider', { provider: {}, url: '' }, true),
  actions: reducerFactory(['fetch'], 'actions', 'actions', [], true),
  contextActions: reducerFactory(['fetch'], 'contextActions', 'context_actions', [], true),
  secrets: reducerFactory(['fetch', 'delete'], 'secrets', 'secrets', []),
  secret: reducerFactory(['fetch', 'create', 'update'], 'secret', 'secret', secretModel, true),
  secretsDropDown: reducerFactory(['fetch'], 'secrets', 'secrets_dropdown', [], true, []),
  search: reducerFactory(['fetch'], 'search', 'search', [], true),
  resourceTypes: reducerFactory(['fetch', 'delete'], 'resourceTypes', 'resourceTypes', []),
  resourceType: reducerFactory(['fetch', 'create', 'update'], 'resourceType', 'resourceType', resourceTypeModel, true),
  sync: reducerFactory(['fetch'], 'sync', 'sync', {}),
});
