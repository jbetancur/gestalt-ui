import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';
import providerSagas from './providers';

export default function* rootSaga() {
  yield all([
    providerSagas(),

    yield takeLatest(...generateFetchAll({ name: 'PROVIDERS', entity: 'providers' })),
    yield takeLatest(...generateFetchOne({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateCreate({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateUpdate({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateDelete({ name: 'PROVIDER', entity: 'providers' })),
    yield takeLatest(...generateDeleteMany({ name: 'PROVIDERS', entity: 'providers' })),
  ]);
}
