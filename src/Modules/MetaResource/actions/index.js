import organizations from './organizations';
import workspaces from './workspaces';
import environments from './environments';
import lambdas from './lambdas';
import apis from './apis';
import apiEndpoints from './apiEndpoints';
import providers from './providers';
import containers from './containers';
import policies from './policies';
import policyRules from './policyRules';
import entitlements from './entitlements';
import users from './users';
import groups from './groups';
import env from './env';
import self from './self';
import logging from './logging';
import actions from './actions';
import secrets from './secrets';
import search from './search';
import resourceTypes from './resourceTypes';
import typeProperties from './typeProperties';
import syncMeta from './sync';

export default Object.assign({},
  organizations,
  workspaces,
  environments,
  lambdas,
  apis,
  apiEndpoints,
  providers,
  containers,
  policies,
  policyRules,
  entitlements,
  users,
  groups,
  env,
  self,
  logging,
  actions,
  secrets,
  search,
  resourceTypes,
  typeProperties,
  syncMeta,
);
