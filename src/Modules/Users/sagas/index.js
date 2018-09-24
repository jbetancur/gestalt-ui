import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

export default function* userSagas() {
  yield all([
    yield takeLatest(...generateFetchAll({ name: 'USERS', entity: 'users' })),
    yield takeLatest(...generateFetchOne({ name: 'USER', entity: 'users' })),
    yield takeLatest(...generateCreate({ name: 'USER', entity: 'users' })),
    yield takeLatest(...generateUpdate({ name: 'USER', entity: 'users' })),
    yield takeLatest(...generateDelete({ name: 'USER', entity: 'users' })),
    yield takeLatest(...generateDeleteMany({ name: 'USERS', entity: 'users' })),
  ]);
}
