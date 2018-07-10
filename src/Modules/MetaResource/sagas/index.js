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
import lambdaSagas from './lambdas';
import providerSagas from './providers';
import containerSagas from './containers';
import selfSagas from './self';
import entitlementSagas from './entitlements';
import groupSagas from './groups';
import env from './env';
import loggingSagas from './logging';
import searchSagas from './search';
import typePropertySagas from './typeProperties';

export default function* metaSagas() {
  yield all([
    orgSagas(),
    lambdaSagas(),
    providerSagas(),
    containerSagas(),
    selfSagas(),
    entitlementSagas(),
    groupSagas(),
    env(),
    loggingSagas(),
    searchSagas(),
    typePropertySagas(),

    yield takeLatest(...generateFetchAll('ORGS')),
    yield takeLatest(...generateFetchOne('ORG')),
    yield takeLatest(...generateCreate('ORG')),
    yield takeLatest(...generateUpdate('ORG')),
    yield takeLatest(...generateDelete('ORG')),

    yield takeLatest(...generateFetchAll('WORKSPACES', 'workspaces')),
    yield takeLatest(...generateFetchOne('WORKSPACE', 'workspaces')),
    yield takeLatest(...generateCreate('WORKSPACE', 'workspaces')),
    yield takeLatest(...generateUpdate('WORKSPACE', 'workspaces')),
    yield takeLatest(...generateDelete('WORKSPACE', 'workspaces')),

    yield takeLatest(...generateFetchAll('ENVIRONMENTS', 'environments')),
    yield takeLatest(...generateFetchOne('ENVIRONMENT', 'environments')),
    yield takeLatest(...generateCreate('ENVIRONMENT', 'environments')),
    yield takeLatest(...generateUpdate('ENVIRONMENT', 'environments')),
    yield takeLatest(...generateDelete('ENVIRONMENT', 'environments')),

    yield takeLatest(...generateFetchAll('USERS', 'users')),
    yield takeLatest(...generateFetchOne('USER', 'users')),
    yield takeLatest(...generateCreate('USER', 'users')),
    yield takeLatest(...generateUpdate('USER', 'users')),
    yield takeLatest(...generateDelete('USER', 'users', 'USERS')),
    yield takeLatest(...generateDeleteMany('USERS', 'users')),

    yield takeLatest(...generateCreate('CONTAINER', 'containers', 'IMPORT')),
    yield takeLatest(...generateCreate('CONTAINER', 'containers', 'DETACH')),

    yield takeLatest(...generateFetchAll('POLICIES', 'policies')),
    yield takeLatest(...generateFetchOne('POLICY', 'policies')),
    yield takeLatest(...generateCreate('POLICY', 'policies')),
    yield takeLatest(...generateUpdate('POLICY', 'policies')),
    yield takeLatest(...generateDelete('POLICY', 'policies')),
    yield takeLatest(...generateDeleteMany('POLICIES', 'policies')),

    yield takeLatest(...generateFetchAll('POLICYRULES', 'rules')),
    yield takeLatest(...generateFetchOne('POLICYRULE', 'rules')),
    yield takeLatest(...generateCreate('POLICYRULE', 'rules')),
    yield takeLatest(...generateUpdate('POLICYRULE', 'rules')),
    yield takeLatest(...generateDelete('POLICYRULE', 'rules')),
    yield takeLatest(...generateDeleteMany('POLICYRULES', 'rules')),

    yield takeLatest(...generateFetchAll('APIS', 'apis')),
    yield takeLatest(...generateFetchOne('API', 'apis')),
    yield takeLatest(...generateCreate('API', 'apis')),
    yield takeLatest(...generateUpdate('API', 'apis')),
    yield takeLatest(...generateDelete('API', 'apis')),
    yield takeLatest(...generateDeleteMany('APIS', 'apis')),

    yield takeLatest(...generateFetchAll('APIENDPOINTS', 'apiendpoints')),
    yield takeLatest(...generateFetchOne('APIENDPOINT', 'apiendpoints')),
    yield takeLatest(...generateCreate('APIENDPOINT', 'apiendpoints')),
    yield takeLatest(...generateUpdate('APIENDPOINT', 'apiendpoints')),
    yield takeLatest(...generateDelete('APIENDPOINT', 'apiendpoints', 'APIENDPOINTS')),
    yield takeLatest(...generateDeleteMany('APIENDPOINTS', 'apiendpoints')),

    yield takeLatest(...generateFetchAll('SECRETS', 'secrets')),
    yield takeLatest(...generateFetchOne('SECRET', 'secrets')),
    yield takeLatest(...generateCreate('SECRET', 'secrets')),
    yield takeLatest(...generateUpdate('SECRET', 'secrets')),
    yield takeLatest(...generateDelete('SECRET', 'secrets')),
    yield takeLatest(...generateDeleteMany('SECRETS', 'secrets')),

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
