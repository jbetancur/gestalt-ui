import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
} from 'config/lib/sagaFactory';
import providerSagas from './providers';
import formWorkflows from './formWorkflows';

export default function* rootSaga() {
  yield all([
    providerSagas(),
    formWorkflows(),

    yield takeLatest(...generateFetchAll({ name: 'PROVIDERS', entity: 'providers' })),
    yield takeLatest(...generateFetchOne({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateCreate({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateUpdate({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateDelete({ name: 'PROVIDER', entity: 'providers' })),
  ]);
}
