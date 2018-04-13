import { all, takeLatest } from 'redux-saga/effects';
import { fetchAll, fetchOne, create, update, deleteOne, deleteMany } from '../lib/factory';
import * as types from '../actionTypes';

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
import loggingSagas from './logging';
import secretSagas from './secrets';
import searchSagas from './search';
import resourceTypeSagas from './resourceTypes';
import typePropertySagas from './typeProperties';
import syncSagas from './sync';
import serviceSpecSagas from './serviceSpecs';
// import datafeedSagas from './datafeeds';

export default function* metaSagas() {
  yield all([
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
    loggingSagas(),
    secretSagas(),
    searchSagas(),
    resourceTypeSagas(),
    typePropertySagas(),
    syncSagas(),
    serviceSpecSagas(),
    yield takeLatest(types.FETCH_DATAFEEDS_REQUEST, fetchAll('DATAFEEDS', 'datafeeds')),
    yield takeLatest(types.FETCH_DATAFEED_REQUEST, fetchOne('DATAFEED', 'datafeeds')),
    yield takeLatest(types.CREATE_DATAFEED_REQUEST, create('DATAFEED', 'datafeeds')),
    yield takeLatest(types.UPDATE_DATAFEED_REQUEST, update('DATAFEED', 'datafeeds')),
    yield takeLatest(types.DELETE_DATAFEED_REQUEST, deleteOne('DATAFEED', 'datafeeds')),
    yield takeLatest(types.DELETE_DATAFEEDS_REQUEST, deleteMany('DATAFEEDS', 'datafeeds')),
    yield takeLatest(types.FETCH_STREAMSPECS_REQUEST, fetchAll('STREAMSPECS', 'streamspecs')),
    yield takeLatest(types.FETCH_STREAMSPEC_REQUEST, fetchOne('STREAMSPEC', 'streamspecs')),
    yield takeLatest(types.CREATE_STREAMSPEC_REQUEST, create('STREAMSPEC', 'streamspecs')),
    yield takeLatest(types.UPDATE_STREAMSPEC_REQUEST, update('STREAMSPEC', 'streamspecs')),
    yield takeLatest(types.DELETE_STREAMSPEC_REQUEST, deleteOne('STREAMSPEC', 'streamspecs')),
    yield takeLatest(types.DELETE_STREAMSPECS_REQUEST, deleteMany('STREAMSPECS', 'streamspecs')),
  ]);
}
