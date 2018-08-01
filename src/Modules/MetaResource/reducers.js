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
  envSchema: reducerFactory({
    verbs: ['fetch'],
    key: 'schema',
    category: 'env_schema',
    model: envSchemaModel.get(),
  }),
  allOrganizations: reducerFactory({
    verbs: ['fetch'],
    key: 'organizations',
    category: 'allorgs',
    model: [],
  }),
  allOrganizationsDropDown: reducerFactory({
    verbs: ['fetch'],
    key: 'organizations',
    category: 'ALLORGSDROPDOWN',
    model: [],
  }),
  organizations: reducerFactory({
    verbs: ['fetch'],
    key: 'organizations',
    category: 'orgs',
    model: [],
  }),
  organization: reducerFactory({
    verbs: ['fetch', 'create', 'update', 'delete'],
    key: 'organization',
    category: 'org',
    model: organizationModel.get(),
  }),
  organizationSet: reducerFactory({
    verbs: ['fetch', 'create', 'update', 'delete'],
    key: 'organization',
    category: 'orgset',
    model: organizationModel.get(),
  }),
  workspaces: reducerFactory({
    verbs: ['fetch'],
    key: 'workspaces',
    category: 'workspaces',
    model: [],
  }),
  workspace: reducerFactory({
    verbs: ['fetch', 'create', 'update', 'delete'],
    key: 'workspace',
    category: 'workspace',
    model: workspaceModel.get(),
  }),
  environments: reducerFactory({
    verbs: ['fetch'],
    key: 'environments',
    category: 'environments',
    model: [],
  }),
  environment: reducerFactory({
    verbs: ['fetch', 'create', 'update', 'delete'],
    key: 'environment',
    category: 'environment',
    model: environmentModel.get(),
  }),
  lambdas: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'lambdas',
    category: 'lambdas',
    model: [],
    unloadOnRouteChange: true,
  }),
  lambda: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'lambda',
    category: 'lambda',
    model: lambdaModel.get(),
  }),
  apis: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'apis',
    category: 'apis',
    model: [],
    unloadOnRouteChange: true,
  }),
  api: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'api',
    category: 'api',
    model: apiModel.get(),
  }),
  apiEndpoints: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'apiEndpoints',
    category: 'apiEndpoints',
    model: [],
    unloadOnRouteChange: true,
  }),
  apiEndpoint: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'apiEndpoint',
    category: 'apiEndpoint',
    model: apiEndpointModel.get(),
  }),
  providers: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'providers',
    category: 'providers',
    model: [],
    unloadOnRouteChange: true,
  }),
  provider: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'provider',
    category: 'provider',
    model: providerModel.get(),
  }),
  containers: reducerFactory({
    verbs: ['fetch'],
    key: 'containers',
    category: 'containers',
    model: [],
    unloadOnRouteChange: true,
  }),
  container: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'container',
    category: 'container',
    model: containerModel.get(),
  }),
  containerImport: reducerFactory({
    verbs: ['import'],
    key: 'container',
    category: 'container',
    model: containerModel.get(),
  }),
  policies: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'policies',
    category: 'policies',
    model: [],
    unloadOnRouteChange: true,
  }),
  policy: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'policy',
    category: 'policy',
    model: policyModel.get(),
  }),
  policyRules: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'policyRules',
    category: 'policyRules',
    model: [],
    unloadOnRouteChange: true,
  }),
  policyRule: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'policyRule',
    category: 'policyRule',
    model: policyRuleModel.get(),
  }),
  entitlements: reducerFactory({
    verbs: ['fetch', 'update'],
    key: 'entitlements',
    category: 'entitlements',
    model: [],
  }),
  entitlementIdentities: reducerFactory({
    verbs: ['fetch'],
    key: 'identities',
    category: 'identities',
    model: [],
  }),
  users: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'users',
    category: 'users',
    model: [],
    unloadOnRouteChange: true,
  }),
  user: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'user',
    category: 'user',
    model: userModel.get(),
  }),
  groups: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'groups',
    category: 'groups',
    model: [],
    unloadOnRouteChange: true,
  }),
  group: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'group',
    category: 'group',
    model: groupModel.get(),
  }),
  groupMembers: reducerFactory({
    verbs: ['add', 'remove'],
    key: 'group',
    category: 'groupmember',
    model: groupModel.get(),
  }),
  env: reducerFactory({
    verbs: ['fetch'],
    key: 'env',
    category: 'env',
    model: {},
  }),
  self: reducerFactory({
    verbs: ['fetch'],
    key: 'self',
    category: 'self',
    model: selfModel.get(),
  }),
  logProvider: reducerFactory({
    verbs: ['fetch'],
    key: 'logProvider',
    category: 'logprovider',
    model: { provider: {}, url: '' },
  }),
  secrets: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'secrets',
    category: 'secrets',
    model: [],
    unloadOnRouteChange: true,
  }),
  secret: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'secret',
    category: 'secret',
    model: secretModel.get(),
  }),
  searchUsers: reducerFactory({
    verbs: ['do'],
    key: 'searchUsers',
    category: 'searchUsers',
    model: [],
  }),
  searchAssets: reducerFactory({
    verbs: ['do'],
    key: 'searchAssets',
    category: 'searchAssets',
    model: [],
  }),
  resourceTypes: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'resourceTypes',
    category: 'resourceTypes',
    model: [],
    unloadOnRouteChange: true,
  }),
  resourceType: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'resourceType',
    category: 'resourceType',
    model: resourceTypeModel.get(),
  }),
  sync: reducerFactory({
    verbs: ['do'],
    key: 'sync',
    category: 'sync',
    model: {},
  }),
  serviceSpecs: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'serviceSpecs',
    category: 'serviceSpecs',
    model: [],
    unloadOnRouteChange: true,
  }),
  serviceSpec: reducerFactory({
    verbs: ['create', 'update', 'delete'],
    key: 'serviceSpec',
    category: 'serviceSpec',
    model: serviceSpecModel.get(),
  }),
  datafeeds: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'datafeeds',
    category: 'datafeeds',
    model: [],
    unloadOnRouteChange: true,
  }),
  datafeed: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'datafeed',
    category: 'datafeed',
    model: datafeedModel.get(),
  }),
  streamSpecs: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'streamSpecs',
    category: 'streamSpecs',
    model: [],
    unloadOnRouteChange: true,
  }),
  streamSpec: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'streamSpec',
    category: 'streamSpec',
    model: streamSpecModel.get(),
  }),
});
