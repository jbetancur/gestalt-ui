import { all } from 'redux-saga/effects';
import lambdaSagas from './lambdas';

export default function* rootSaga() {
  yield all([
    lambdaSagas()
  ]);
}
