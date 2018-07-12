import { fork, take, put } from 'redux-saga/effects';
import * as types from '../actionTypes';


// Deal with Clearing the container State
function* watchEnvironmentContext() {
  while (true) {
    yield take(types.UNLOAD_ENVIRONMENT);

    yield put({ type: types.UNLOAD_CONTAINERS });
    yield put({ type: types.UNLOAD_CONTAINER });
  }
};

// Watchers
export default function* () {
  yield fork(watchEnvironmentContext);
}
