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
import logging from './logging';
import secrets from './secrets';
import search from './search';
import typeProperties from './typeProperties';

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
  logging,
  secrets,
  search,
  typeProperties,
);
