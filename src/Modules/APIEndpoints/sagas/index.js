import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

export default function* apiEndpointSagas() {
  yield all([
    yield takeLatest(...generateFetchAll({ name: 'APIENDPOINTS', entity: 'apiendpoints' })),
    yield takeLatest(...generateFetchOne({ name: 'APIENDPOINT', entity: 'apiendpoints' })),
    yield takeLatest(...generateCreate({ name: 'APIENDPOINT', entity: 'apiendpoints' })),
    yield takeLatest(...generateUpdate({ name: 'APIENDPOINT', entity: 'apiendpoints' })),
    yield takeLatest(...generateDelete({ name: 'APIENDPOINT', entity: 'apiendpoints', parentName: 'APIENDPOINTS' })),
    yield takeLatest(...generateDeleteMany({ name: 'APIENDPOINTS', entity: 'apiendpoints' })),
  ]);
}
