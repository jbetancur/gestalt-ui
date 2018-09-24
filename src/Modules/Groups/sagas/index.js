import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

import groupMemberSagas from './members';

export default function* groupSagas() {
  yield all([
    groupMemberSagas(),

    yield takeLatest(...generateFetchAll({ name: 'GROUPS', entity: 'groups' })),
    yield takeLatest(...generateFetchOne({ name: 'GROUP', entity: 'groups' })),
    yield takeLatest(...generateCreate({ name: 'GROUP', entity: 'groups' })),
    yield takeLatest(...generateUpdate({ name: 'GROUP', entity: 'groups' })),
    yield takeLatest(...generateDelete({ name: 'GROUP', entity: 'groups' })),
    yield takeLatest(...generateDeleteMany({ name: 'GROUPS', entity: 'groups' })),
  ]);
}
