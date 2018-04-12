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
import actionSagas from './actions';
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
    actionSagas(),
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
    yield takeLatest(types.FETCH_STREAMS_REQUEST, fetchAll('STREAMS', 'streamspecs')),
    yield takeLatest(types.FETCH_STREAM_REQUEST, fetchOne('STREAM', 'streamspecs')),
    yield takeLatest(types.CREATE_STREAM_REQUEST, create('STREAM', 'streamspecs')),
    yield takeLatest(types.UPDATE_STREAM_REQUEST, update('STREAM', 'streamspecs')),
    yield takeLatest(types.DELETE_STREAM_REQUEST, deleteOne('STREAM', 'streamspecs')),
    yield takeLatest(types.DELETE_STREAMS_REQUEST, deleteMany('STREAMS', 'streamspecs')),
  ]);
}
