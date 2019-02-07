import { all } from 'redux-saga/effects';
import { authSagas } from 'Modules/Authentication';
import { apiSagas } from 'Modules/APIs';
import { apiEndpointSagas } from 'Modules/APIEndpoints';
import { hierarchySagas } from 'Modules/Hierarchy';
import { notifierSagas } from 'Modules/Notifications';
import { containerSagas } from 'Modules/Containers';
import { dataFeedSagas } from 'Modules/DataFeeds';
import { lambdaSagas } from 'Modules/Lambdas';
import { policySagas } from 'Modules/Policies';
import { policyRuleSagas } from 'Modules/PolicyRules';
import { providerSagas } from 'Modules/Providers';
import { entitlementSagas } from 'Modules/Entitlements';
import { resourceTypeSagas } from 'Modules/ResourceTypes';
import { groupSagas } from 'Modules/Groups';
import { userSagas } from 'Modules/Users';
import { searchSagas } from 'Modules/Search';
import { secretSagas } from 'Modules/Secrets';
import { streamSpecSagas } from 'Modules/Streams';
import { loggingSagas } from 'Modules/Logging';
import { volumeSagas } from 'Modules/Volumes';
import appDeploymentSagas from 'Modules/AppDeployments/sagas';
import upgraderSagas from 'Modules/Upgrader/sagas';
import userProfileSagas from 'Modules/UserProfile/sagas';

export default function* rootSaga() {
  yield all([
    authSagas(),
    apiSagas(),
    apiEndpointSagas(),
    hierarchySagas(),
    notifierSagas(),
    containerSagas(),
    dataFeedSagas(),
    lambdaSagas(),
    policySagas(),
    policyRuleSagas(),
    providerSagas(),
    entitlementSagas(),
    resourceTypeSagas(),
    groupSagas(),
    userSagas(),
    searchSagas(),
    secretSagas(),
    streamSpecSagas(),
    loggingSagas(),
    volumeSagas(),
    appDeploymentSagas(),
    upgraderSagas(),
    userProfileSagas(),
  ]);
}
