import { all } from 'redux-saga/effects';
import entitlementSagas from './entitlements';

export default function* rootSaga() {
  yield all([
    entitlementSagas()
  ]);
}
