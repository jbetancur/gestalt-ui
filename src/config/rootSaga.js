import { all } from 'redux-saga/effects';
import { metaSagas } from 'Modules/MetaResource';
import { authSagas } from 'Modules/Authentication';
import { notifierSagas } from 'Modules/Notifications';

export default function* rootSaga() {
  yield all([
    metaSagas(),
    authSagas(),
    notifierSagas(),
  ]);
}
