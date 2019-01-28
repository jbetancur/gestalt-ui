import { takeLatest, put, call, fork, race, take, cancelled } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';
import { poll, fetchAPI } from 'config/lib/utility';
import {
  INIT_STREAMSPECEDIT_FULFILLED,
  POLL_STREAMSPEC_FULFILLED,
  POLL_STREAMSPEC_CANCELLED,
  UNLOAD_STREAMSPEC,
} from '../constants';

/**
 * fetchContainer
 * @param {*} action { fqon, containerId, entityKey, entityId }
 */
export function* pollStreamSpecInstances(action) {
  try {
    const { data } = yield call(fetchAPI, `${action.payload.streamSpec.org.properties.fqon}/streamspecs/${action.payload.streamSpec.id}`);

    yield put({ type: POLL_STREAMSPEC_FULFILLED, payload: data.properties.streams, action });
  } catch (e) {
    // Just Eeat it
  } finally {
    if (yield cancelled()) {
      yield put({ type: POLL_STREAMSPEC_CANCELLED });
    }
  }
}

// Kicks off the Workflow but can be cancelled by any event in the race
// also prevents polling mid request e.g. nav changes
export function* watchStreamequestWorkflow() {
  yield takeLatest(INIT_STREAMSPECEDIT_FULFILLED, function* raceStreamSpec(...args) {
    yield race({
      task: call(poll, pollStreamSpecInstances, ...args, 5000),
      cancel: take(UNLOAD_STREAMSPEC),
      cancelled: take(POLL_STREAMSPEC_CANCELLED),
      cancelRoute: take(LOCATION_CHANGE),
    });
  });
}

// Watchers
export default function* () {
  yield fork(watchStreamequestWorkflow);
}
