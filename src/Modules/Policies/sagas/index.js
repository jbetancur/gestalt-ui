import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

export default function* policySagas() {
  yield all([
    yield takeLatest(...generateFetchAll({ name: 'POLICIES', entity: 'policies' })),
    yield takeLatest(...generateFetchOne({ name: 'POLICY', entity: 'policies' })),
    yield takeLatest(...generateCreate({ name: 'POLICY', entity: 'policies' })),
    yield takeLatest(...generateUpdate({ name: 'POLICY', entity: 'policies' })),
    yield takeLatest(...generateDelete({ name: 'POLICY', entity: 'policies' })),
    yield takeLatest(...generateDeleteMany({ name: 'POLICIES', entity: 'policies' })),
  ]);
}
