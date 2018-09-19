import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

export default function* serviceSpecSagas() {
  yield all([
    yield takeLatest(...generateFetchAll({ name: 'SERVICESPECS', entity: 'servicespecs' })),
    yield takeLatest(...generateFetchOne({ name: 'SERVICESPEC', entity: 'servicespecs' })),
    yield takeLatest(...generateCreate({ name: 'SERVICESPEC', entity: 'servicespecs' })),
    yield takeLatest(...generateUpdate({ name: 'SERVICESPEC', entity: 'servicespecs' })),
    yield takeLatest(...generateDelete({ name: 'SERVICESPEC', entity: 'servicespecs' })),
    yield takeLatest(...generateDeleteMany({ name: 'SERVICESPECS', entity: 'servicespecs' })),
  ]);
}
