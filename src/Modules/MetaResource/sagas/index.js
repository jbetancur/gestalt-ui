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
import containerSagas from './containers';
import selfSagas from './self';
import entitlementSagas from './entitlements';
import groupSagas from './groups';
import env from './env';
import loggingSagas from './logging';
import searchSagas from './search';
import typePropertySagas from './typeProperties';
import providersSagas from './providers';

export default function* metaSagas() {
  yield all([
    orgSagas(),
    lambdaSagas(),
    containerSagas(),
    selfSagas(),
    entitlementSagas(),
    groupSagas(),
    env(),
    loggingSagas(),
    searchSagas(),
    typePropertySagas(),
    providersSagas(),

    yield takeLatest(...generateFetchAll({ name: 'ORGS' })),
    yield takeLatest(...generateFetchOne({ name: 'ORG' })),
    yield takeLatest(...generateCreate({ name: 'ORG' })),
    yield takeLatest(...generateUpdate({ name: 'ORG' })),
    yield takeLatest(...generateDelete({ name: 'ORG' })),

    yield takeLatest(...generateFetchAll({ name: 'WORKSPACES', entity: 'workspaces' })),
    yield takeLatest(...generateFetchOne({ name: 'WORKSPACE', entity: 'workspaces' })),
    yield takeLatest(...generateCreate({ name: 'WORKSPACE', entity: 'workspaces' })),
    yield takeLatest(...generateUpdate({ name: 'WORKSPACE', entity: 'workspaces' })),
    yield takeLatest(...generateDelete({ name: 'WORKSPACE', entity: 'workspaces' })),

    yield takeLatest(...generateFetchAll({ name: 'ENVIRONMENTS', entity: 'environments' })),
    yield takeLatest(...generateFetchOne({ name: 'ENVIRONMENT', entity: 'environments' })),
    yield takeLatest(...generateCreate({ name: 'ENVIRONMENT', entity: 'environments' })),
    yield takeLatest(...generateUpdate({ name: 'ENVIRONMENT', entity: 'environments' })),
    yield takeLatest(...generateDelete({ name: 'ENVIRONMENT', entity: 'environments' })),

    yield takeLatest(...generateFetchAll({ name: 'USERS', entity: 'users' })),
    yield takeLatest(...generateFetchOne({ name: 'USER', entity: 'users' })),
    yield takeLatest(...generateCreate({ name: 'USER', entity: 'users' })),
    yield takeLatest(...generateUpdate({ name: 'USER', entity: 'users' })),
    yield takeLatest(...generateDelete({ name: 'USER', entity: 'users', verb: 'USERS' })),
    yield takeLatest(...generateDeleteMany({ name: 'USERS', entity: 'users' })),

    yield takeLatest(...generateFetchAll({ name: 'GROUPS', entity: 'groups' })),
    yield takeLatest(...generateFetchOne({ name: 'GROUP', entity: 'groups' })),
    yield takeLatest(...generateCreate({ name: 'GROUP', entity: 'groups' })),
    yield takeLatest(...generateUpdate({ name: 'GROUP', entity: 'groups' })),
    yield takeLatest(...generateDelete({ name: 'GROUP', entity: 'groups', verb: 'GROUPS' })),
    yield takeLatest(...generateDeleteMany({ name: 'GROUPS', entity: 'groups' })),

    yield takeLatest(...generateCreate({ name: 'CONTAINER', entity: 'containers', verb: 'IMPORT' })),
    yield takeLatest(...generateCreate({ name: 'CONTAINER', entity: 'containers', verb: 'DETACH' })),

    yield takeLatest(...generateFetchAll({ name: 'POLICIES', entity: 'policies' })),
    yield takeLatest(...generateFetchOne({ name: 'POLICY', entity: 'policies' })),
    yield takeLatest(...generateCreate({ name: 'POLICY', entity: 'policies' })),
    yield takeLatest(...generateUpdate({ name: 'POLICY', entity: 'policies' })),
    yield takeLatest(...generateDelete({ name: 'POLICY', entity: 'policies' })),
    yield takeLatest(...generateDeleteMany({ name: 'POLICIES', entity: 'policies' })),

    yield takeLatest(...generateFetchAll({ name: 'POLICYRULES', entity: 'rules' })),
    yield takeLatest(...generateFetchOne({ name: 'POLICYRULE', entity: 'rules' })),
    yield takeLatest(...generateCreate({ name: 'POLICYRULE', entity: 'rules' })),
    yield takeLatest(...generateUpdate({ name: 'POLICYRULE', entity: 'rules' })),
    yield takeLatest(...generateDelete({ name: 'POLICYRULE', entity: 'rules' })),
    yield takeLatest(...generateDeleteMany({ name: 'POLICYRULES', entity: 'rules' })),

    yield takeLatest(...generateFetchAll({ name: 'APIS', entity: 'apis' })),
    yield takeLatest(...generateFetchOne({ name: 'API', entity: 'apis' })),
    yield takeLatest(...generateCreate({ name: 'API', entity: 'apis' })),
    yield takeLatest(...generateUpdate({ name: 'API', entity: 'apis' })),
    yield takeLatest(...generateDelete({ name: 'API', entity: 'apis' })),
    yield takeLatest(...generateDeleteMany({ name: 'APIS', entity: 'apis' })),

    yield takeLatest(...generateFetchAll({ name: 'APIENDPOINTS', entity: 'apiendpoints' })),
    yield takeLatest(...generateFetchOne({ name: 'APIENDPOINT', entity: 'apiendpoints' })),
    yield takeLatest(...generateCreate({ name: 'APIENDPOINT', entity: 'apiendpoints' })),
    yield takeLatest(...generateUpdate({ name: 'APIENDPOINT', entity: 'apiendpoints' })),
    yield takeLatest(...generateDelete({ name: 'APIENDPOINT', entity: 'apiendpoints', verb: 'APIENDPOINTS' })),
    yield takeLatest(...generateDeleteMany({ name: 'APIENDPOINTS', entity: 'apiendpoints' })),

    yield takeLatest(...generateFetchAll({ name: 'SECRETS', entity: 'secrets' })),
    yield takeLatest(...generateFetchOne({ name: 'SECRET', entity: 'secrets' })),
    yield takeLatest(...generateCreate({ name: 'SECRET', entity: 'secrets' })),
    yield takeLatest(...generateUpdate({ name: 'SECRET', entity: 'secrets' })),
    yield takeLatest(...generateDelete({ name: 'SECRET', entity: 'secrets' })),
    yield takeLatest(...generateDeleteMany({ name: 'SECRETS', entity: 'secrets' })),

    yield takeLatest(...generateFetchAll({ name: 'SERVICESPECS', entity: 'servicespecs' })),
    yield takeLatest(...generateFetchOne({ name: 'SERVICESPEC', entity: 'servicespecs' })),
    yield takeLatest(...generateCreate({ name: 'SERVICESPEC', entity: 'servicespecs' })),
    yield takeLatest(...generateUpdate({ name: 'SERVICESPEC', entity: 'servicespecs' })),
    yield takeLatest(...generateDelete({ name: 'SERVICESPEC', entity: 'servicespecs' })),
    yield takeLatest(...generateDeleteMany({ name: 'SERVICESPECS', entity: 'servicespecs' })),

    yield takeLatest(...generateCreate({ name: 'SYNC', entity: 'sync', verb: 'DO' })),

    yield takeLatest(...generateFetchAll({ name: 'DATAFEEDS', entity: 'datafeeds' })),
    yield takeLatest(...generateFetchOne({ name: 'DATAFEED', entity: 'datafeeds' })),
    yield takeLatest(...generateCreate({ name: 'DATAFEED', entity: 'datafeeds' })),
    yield takeLatest(...generateUpdate({ name: 'DATAFEED', entity: 'datafeeds' })),
    yield takeLatest(...generateDelete({ name: 'DATAFEED', entity: 'datafeeds' })),
    yield takeLatest(...generateDeleteMany({ name: 'DATAFEEDS', entity: 'datafeeds' })),

    yield takeLatest(...generateFetchAll({ name: 'STREAMSPECS', entity: 'streamspecs' })),
    yield takeLatest(...generateFetchOne({ name: 'STREAMSPEC', entity: 'streamspecs' })),
    yield takeLatest(...generateCreate({ name: 'STREAMSPEC', entity: 'streamspecs' })),
    yield takeLatest(...generateUpdate({ name: 'STREAMSPEC', entity: 'streamspecs' })),
    yield takeLatest(...generateDelete({ name: 'STREAMSPEC', entity: 'streamspecs' })),
    yield takeLatest(...generateDeleteMany({ name: 'STREAMSPECS', entity: 'streamspecs' })),

    yield takeLatest(...generateFetchAll({ name: 'RESOURCETYPES', entity: 'resourcetypes' })),
    yield takeLatest(...generateFetchOne({ name: 'RESOURCETYPE', entity: 'resourcetypes' })),
    yield takeLatest(...generateCreate({ name: 'RESOURCETYPE', entity: 'resourcetypes' })),
    yield takeLatest(...generateUpdate({ name: 'RESOURCETYPE', entity: 'resourcetypes' })),
    yield takeLatest(...generateDelete({ name: 'RESOURCETYPE', entity: 'resourcetypes' })),
    yield takeLatest(...generateDeleteMany({ name: 'RESOURCETYPES', entity: 'resourcetypes' })),

    yield takeLatest(...generateFetchAll({ name: 'VOLUMES', entity: 'volumes' })),
    yield takeLatest(...generateFetchOne({ name: 'VOLUME', entity: 'volumes' })),
    yield takeLatest(...generateCreate({ name: 'VOLUME', entity: 'volumes' })),
    yield takeLatest(...generateUpdate({ name: 'VOLUME', entity: 'volumes' })),
    yield takeLatest(...generateDelete({ name: 'VOLUME', entity: 'volumes' })),
    yield takeLatest(...generateDeleteMany({ name: 'VOLUMES', entity: 'volumes' })),

    yield takeLatest(...generateFetchAll({ name: 'PROVIDERS', entity: 'providers' })),
    yield takeLatest(...generateFetchOne({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateCreate({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateUpdate({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateDelete({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateDeleteMany({ name: 'PROVIDERS', entity: 'providers' })),
  ]);
}
