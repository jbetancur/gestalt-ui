import { all } from 'redux-saga/effects';
import upgraderSagas from './upgrader';

export default function* rootSaga() {
  yield all([
    upgraderSagas()
  ]);
}
