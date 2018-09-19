import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

export default function* secretSagas() {
  yield all([
    yield takeLatest(...generateFetchAll({ name: 'SECRETS', entity: 'secrets' })),
    yield takeLatest(...generateFetchOne({ name: 'SECRET', entity: 'secrets' })),
    yield takeLatest(...generateCreate({ name: 'SECRET', entity: 'secrets' })),
    yield takeLatest(...generateUpdate({ name: 'SECRET', entity: 'secrets' })),
    yield takeLatest(...generateDelete({ name: 'SECRET', entity: 'secrets' })),
    yield takeLatest(...generateDeleteMany({ name: 'SECRETS', entity: 'secrets' })),
  ]);
}
