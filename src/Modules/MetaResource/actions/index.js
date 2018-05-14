import organizations from './organizations';
import workspaces from './workspaces';
import environments from './environments';
import apiEndpoints from './apiEndpoints';
import providers from './providers';
import containers from './containers';
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
  apiEndpoints,
  providers,
  containers,
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
