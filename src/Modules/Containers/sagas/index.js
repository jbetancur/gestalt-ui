import { all, takeLatest } from 'redux-saga/effects';
import {
  generateCreate,
} from 'config/lib/sagaFactory';

import containerActionSagas from './containers';
import containerFormWorkflows from './formWorkflows';

export default function* containerSagas() {
  yield all([
    containerActionSagas(),
    containerFormWorkflows(),

    yield takeLatest(...generateCreate({ name: 'CONTAINER', entity: 'containers', verb: 'IMPORT' })),
    yield takeLatest(...generateCreate({ name: 'CONTAINER', entity: 'containers', verb: 'DETACH' })),
  ]);
}
