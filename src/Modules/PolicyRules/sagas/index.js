import { all, takeLatest } from 'redux-saga/effects';
import {
  generateFetchAll,
  generateFetchOne,
  generateCreate,
  generateUpdate,
  generateDelete,
  generateDeleteMany,
} from 'config/lib/sagaFactory';

export default function* policyRuleSagas() {
  yield all([
    yield takeLatest(...generateFetchAll({ name: 'POLICYRULES', entity: 'rules' })),
    yield takeLatest(...generateFetchOne({ name: 'POLICYRULE', entity: 'rules' })),
    yield takeLatest(...generateCreate({ name: 'POLICYRULE', entity: 'rules' })),
    yield takeLatest(...generateUpdate({ name: 'POLICYRULE', entity: 'rules' })),
    yield takeLatest(...generateDelete({ name: 'POLICYRULE', entity: 'rules' })),
    yield takeLatest(...generateDeleteMany({ name: 'POLICYRULES', entity: 'rules' })),
  ]);
}
