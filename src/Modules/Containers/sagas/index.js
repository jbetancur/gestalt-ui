import { all, takeLatest } from 'redux-saga/effects';
import {
  generateCreate,
} from 'config/lib/sagaFactory';

import containerActionSagas from './containers';

export default function* containerSagas() {
  yield all([
    containerActionSagas(),

    yield takeLatest(...generateCreate({ name: 'CONTAINER', entity: 'containers', verb: 'IMPORT' })),
    yield takeLatest(...generateCreate({ name: 'CONTAINER', entity: 'containers', verb: 'DETACH' })),
  ]);
}
