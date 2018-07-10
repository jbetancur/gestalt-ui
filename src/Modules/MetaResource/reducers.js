import { combineReducers } from 'redux';
import reducerFactory from './lib/reducerFactory';
import selfModel from './models/self';
import organizationModel from './models/organization';
import workspaceModel from './models/workspace';
import environmentModel from './models/environment';
import userModel from './models/user';
import groupModel from './models/group';
import lambdaModel from './models/lambda';
import policyModel from './models/policy';
import policyRuleModel from './models/policyRule';
import apiModel from './models/api';
import apiEndpointModel from './models/apiEndpoint';
import providerModel from './models/provider';
import containerModel from './models/container';
import envSchemaModel from './models/envSchema';
import secretModel from './models/secret';
import resourceTypeModel from './models/resourceType';
import serviceSpecModel from './models/serviceSpec';
import datafeedModel from './models/dataFeed';
import streamSpecModel from './models/streamSpec';

export default combineReducers({
  envSchema: reducerFactory(['fetch'], 'schema', 'env_schema', envSchemaModel),
  allOrganizations: reducerFactory(['fetch'], 'organizations', 'allorgs', []),
  allOrganizationsDropDown: reducerFactory(['fetch'], 'organizations', 'ALLORGSDROPDOWN', []),
  organizations: reducerFactory(['fetch'], 'organizations', 'orgs', []),
  organization: reducerFactory(['fetch', 'create', 'update', 'delete'], 'organization', 'org', organizationModel.get()),
  organizationSet: reducerFactory(['fetch', 'create', 'update', 'delete'], 'organization', 'orgset', organizationModel.get()),
  workspaces: reducerFactory(['fetch'], 'workspaces', 'workspaces', []),
  workspace: reducerFactory(['fetch', 'create', 'update', 'delete'], 'workspace', 'workspace', workspaceModel.get()),
  environments: reducerFactory(['fetch'], 'environments', 'environments', []),
  environment: reducerFactory(['fetch', 'create', 'update', 'delete'], 'environment', 'environment', environmentModel.get()),
  lambdas: reducerFactory(['fetch', 'delete'], 'lambdas', 'lambdas', []),
  lambda: reducerFactory(['fetch', 'create', 'update'], 'lambda', 'lambda', lambdaModel.get()),
  apis: reducerFactory(['fetch', 'delete'], 'apis', 'apis', []),
  api: reducerFactory(['fetch', 'create', 'update'], 'api', 'api', apiModel.get()),
  apiEndpoints: reducerFactory(['fetch', 'delete'], 'apiEndpoints', 'apiEndpoints', []),
  apiEndpoint: reducerFactory(['fetch', 'create', 'update'], 'apiEndpoint', 'apiEndpoint', apiEndpointModel.get()),
  providers: reducerFactory(['fetch', 'delete'], 'providers', 'providers', []),
  provider: reducerFactory(['fetch', 'create', 'update'], 'provider', 'provider', providerModel.get()),
  containers: reducerFactory(['fetch'], 'containers', 'containers', []),
  container: reducerFactory(['fetch', 'create', 'update'], 'container', 'container', containerModel.get()),
  containerImport: reducerFactory(['import'], 'container', 'container', containerModel.get()),
  policies: reducerFactory(['fetch', 'delete'], 'policies', 'policies', []),
  policy: reducerFactory(['fetch', 'create', 'update'], 'policy', 'policy', policyModel.get()),
  policyRules: reducerFactory(['fetch', 'delete'], 'policyRules', 'policyRules', []),
  policyRule: reducerFactory(['fetch', 'create', 'update'], 'policyRule', 'policyRule', policyRuleModel.get()),
  entitlements: reducerFactory(['fetch', 'update'], 'entitlements', 'entitlements', []),
  entitlementIdentities: reducerFactory(['fetch'], 'identities', 'identities', []),
  users: reducerFactory(['fetch', 'delete'], 'users', 'users', []),
  user: reducerFactory(['fetch', 'create', 'update'], 'user', 'user', userModel),
  groups: reducerFactory(['fetch', 'delete'], 'groups', 'groups', []),
  group: reducerFactory(['fetch', 'create', 'update'], 'group', 'group', groupModel),
  groupMembers: reducerFactory(['add', 'remove'], 'group', 'group_member', groupModel),
  env: reducerFactory(['fetch'], 'env', 'env', {}),
  self: reducerFactory(['fetch'], 'self', 'self', selfModel),
  logProvider: reducerFactory(['fetch'], 'logProvider', 'logprovider', { provider: {}, url: '' }),
  secrets: reducerFactory(['fetch', 'delete'], 'secrets', 'secrets', []),
  secret: reducerFactory(['fetch', 'create', 'update'], 'secret', 'secret', secretModel.get()),
  search: reducerFactory(['fetch'], 'search', 'search', []),
  resourceTypes: reducerFactory(['fetch', 'delete'], 'resourceTypes', 'resourceTypes', []),
  resourceType: reducerFactory(['fetch', 'create', 'update'], 'resourceType', 'resourceType', resourceTypeModel.get()),
  sync: reducerFactory(['do'], 'sync', 'sync', {}),
  serviceSpecs: reducerFactory(['fetch', 'delete'], 'serviceSpecs', 'serviceSpecs', []),
  serviceSpec: reducerFactory(['create', 'update', 'delete'], 'serviceSpec', 'serviceSpec', serviceSpecModel.get()),
  datafeeds: reducerFactory(['fetch', 'delete'], 'datafeeds', 'datafeeds', []),
  datafeed: reducerFactory(['fetch', 'create', 'update'], 'datafeed', 'datafeed', datafeedModel.get()),
  streamSpecs: reducerFactory(['fetch', 'delete'], 'streamSpecs', 'streamSpecs', []),
  streamSpec: reducerFactory(['fetch', 'create', 'update'], 'streamSpec', 'streamSpec', streamSpecModel.get()),
});
