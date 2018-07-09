import { all } from 'redux-saga/effects';
import { metaSagas } from 'Modules/MetaResource';
import { authSagas } from 'Modules/Authentication';

export default function* rootSaga() {
  yield all([
    metaSagas(),
    authSagas(),
  ]);
}
