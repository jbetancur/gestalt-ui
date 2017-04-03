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
import env from './env';
import contextSagas from './contextMgmt';

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
    env(),
    contextSagas(),
  ];
}
