import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from '../lib/sagaFactory';

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
import typePropertySagas from './typeProperties';

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
    typePropertySagas(),
    yield takeLatest(...generateFetchAll('SERVICESPECS', 'servicespecs')),
    yield takeLatest(...generateFetchOne('SERVICESPEC', 'servicespecs')),
    yield takeLatest(...generateCreate('SERVICESPEC', 'servicespecs')),
    yield takeLatest(...generateUpdate('SERVICESPEC', 'servicespecs')),
    yield takeLatest(...generateDelete('SERVICESPEC', 'servicespecs')),
    yield takeLatest(...generateDeleteMany('SERVICESPECS', 'servicespecs')),

    yield takeLatest(...generateCreate('SYNC', 'sync', 'DO')),

    yield takeLatest(...generateFetchAll('DATAFEEDS', 'datafeeds')),
    yield takeLatest(...generateFetchOne('DATAFEED', 'datafeeds')),
    yield takeLatest(...generateCreate('DATAFEED', 'datafeeds')),
    yield takeLatest(...generateUpdate('DATAFEED', 'datafeeds')),
    yield takeLatest(...generateDelete('DATAFEED', 'datafeeds')),
    yield takeLatest(...generateDeleteMany('DATAFEEDS', 'datafeeds')),

    yield takeLatest(...generateFetchAll('STREAMSPECS', 'streamspecs')),
    yield takeLatest(...generateFetchOne('STREAMSPEC', 'streamspecs')),
    yield takeLatest(...generateCreate('STREAMSPEC', 'streamspecs')),
    yield takeLatest(...generateUpdate('STREAMSPEC', 'streamspecs')),
    yield takeLatest(...generateDelete('STREAMSPEC', 'streamspecs')),
    yield takeLatest(...generateDeleteMany('STREAMSPECS', 'streamspecs')),

    yield takeLatest(...generateFetchAll('RESOURCETYPES', 'resourcetypes')),
    yield takeLatest(...generateFetchOne('RESOURCETYPE', 'resourcetypes')),
    yield takeLatest(...generateCreate('RESOURCETYPE', 'resourcetypes')),
    yield takeLatest(...generateUpdate('RESOURCETYPE', 'resourcetypes')),
    yield takeLatest(...generateDelete('RESOURCETYPE', 'resourcetypes')),
    yield takeLatest(...generateDeleteMany('RESOURCETYPES', 'resourcetypes')),
  ]);
}
