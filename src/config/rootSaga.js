import { all } from 'redux-saga/effects';
import { metaSagas } from 'Modules/MetaResource';

export default function* rootSaga() {
  yield all([
    metaSagas(),
  ]);
}
