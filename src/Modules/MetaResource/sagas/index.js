import orgSagas from './organizations';
import workspaceSagas from './workspaces';
import environmentSagas from './environments';
import lambdaSagas from './lambdas';
import apiSagas from './apis';
import apiEndpointSagas from './apiEndpoints';
import providerSagas from './providers';
import containerSagas from './containers';
import policySagas from './policies';
import policyRuleSagas from './policyRules';
import selfSagas from './self';
import entitlementSagas from './entitlements';
import userSagas from './users';
import groupSagas from './groups';
import env from './env';
import contextSagas from './contextMgmt';
import loggingSagas from './logging';
import actionSagas from './actions';
import secretSagas from './secrets';
import searchSagas from './search';
import resourceTypeSagas from './resourceTypes';
import syncSagas from './sync';

export default function* metaSagas() {
  yield [
    orgSagas(),
    workspaceSagas(),
    environmentSagas(),
    lambdaSagas(),
    apiSagas(),
    apiEndpointSagas(),
    providerSagas(),
    containerSagas(),
    policySagas(),
    policyRuleSagas(),
    selfSagas(),
    entitlementSagas(),
    userSagas(),
    groupSagas(),
    env(),
    contextSagas(),
    loggingSagas(),
    actionSagas(),
    secretSagas(),
    searchSagas(),
    resourceTypeSagas(),
    syncSagas(),
  ];
}
