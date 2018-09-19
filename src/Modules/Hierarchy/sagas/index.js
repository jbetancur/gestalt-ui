import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
} from 'config/lib/sagaFactory';
import selfSagas from './self';
import organizationSagas from './organizations';

export default function* rootSaga() {
  yield all([
    selfSagas(),
    organizationSagas(),

    yield takeLatest(...generateCreate({ name: 'SYNC', entity: 'sync', verb: 'DO' })),

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
  ]);
}
