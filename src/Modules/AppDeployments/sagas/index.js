import { all } from 'redux-saga/effects';
import appDeploymentSagas from './appDeployments';

export default function* rootSaga() {
  yield all([
    appDeploymentSagas()
  ]);
}
