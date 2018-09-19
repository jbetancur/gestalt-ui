import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

export default function* volumeSagas() {
  yield all([
    yield takeLatest(...generateFetchAll({ name: 'VOLUMES', entity: 'volumes' })),
    yield takeLatest(...generateFetchOne({ name: 'VOLUME', entity: 'volumes' })),
    yield takeLatest(...generateCreate({ name: 'VOLUME', entity: 'volumes' })),
    yield takeLatest(...generateUpdate({ name: 'VOLUME', entity: 'volumes' })),
    yield takeLatest(...generateDelete({ name: 'VOLUME', entity: 'volumes' })),
    yield takeLatest(...generateDeleteMany({ name: 'VOLUMES', entity: 'volumes' })),
  ]);
}
