import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

export default function* dataFeedSagas() {
  yield all([
    yield takeLatest(...generateFetchAll({ name: 'DATAFEEDS', entity: 'datafeeds' })),
    yield takeLatest(...generateFetchOne({ name: 'DATAFEED', entity: 'datafeeds' })),
    yield takeLatest(...generateCreate({ name: 'DATAFEED', entity: 'datafeeds' })),
    yield takeLatest(...generateUpdate({ name: 'DATAFEED', entity: 'datafeeds' })),
    yield takeLatest(...generateDelete({ name: 'DATAFEED', entity: 'datafeeds' })),
    yield takeLatest(...generateDeleteMany({ name: 'DATAFEEDS', entity: 'datafeeds' })),
  ]);
}
