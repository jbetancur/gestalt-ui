import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

import typePropSagas from './typeProps';

export default function* streamSpecSagas() {
  yield all([
    typePropSagas(),

    yield takeLatest(...generateFetchAll({ name: 'RESOURCETYPES', entity: 'resourcetypes' })),
    yield takeLatest(...generateFetchOne({ name: 'RESOURCETYPE', entity: 'resourcetypes' })),
    yield takeLatest(...generateCreate({ name: 'RESOURCETYPE', entity: 'resourcetypes' })),
    yield takeLatest(...generateUpdate({ name: 'RESOURCETYPE', entity: 'resourcetypes' })),
    yield takeLatest(...generateDelete({ name: 'RESOURCETYPE', entity: 'resourcetypes' })),
    yield takeLatest(...generateDeleteMany({ name: 'RESOURCETYPES', entity: 'resourcetypes' })),
  ]);
}
