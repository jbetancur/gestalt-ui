import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

export default function* streamSpecSagas() {
  yield all([
    yield takeLatest(...generateFetchAll({ name: 'STREAMSPECS', entity: 'streamspecs' })),
    yield takeLatest(...generateFetchOne({ name: 'STREAMSPEC', entity: 'streamspecs' })),
    yield takeLatest(...generateCreate({ name: 'STREAMSPEC', entity: 'streamspecs' })),
    yield takeLatest(...generateUpdate({ name: 'STREAMSPEC', entity: 'streamspecs' })),
    yield takeLatest(...generateDelete({ name: 'STREAMSPEC', entity: 'streamspecs' })),
    yield takeLatest(...generateDeleteMany({ name: 'STREAMSPECS', entity: 'streamspecs' })),
  ]);
}
