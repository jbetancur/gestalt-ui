import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

export default function* apiSagas() {
  yield all([
    yield takeLatest(...generateFetchAll({ name: 'APIS', entity: 'apis' })),
    yield takeLatest(...generateFetchOne({ name: 'API', entity: 'apis' })),
    yield takeLatest(...generateCreate({ name: 'API', entity: 'apis' })),
    yield takeLatest(...generateUpdate({ name: 'API', entity: 'apis' })),
    yield takeLatest(...generateDelete({ name: 'API', entity: 'apis' })),
    yield takeLatest(...generateDeleteMany({ name: 'APIS', entity: 'apis' })),
  ]);
}
