import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * sync
 * @param {Object} action - { fqon, entity, value, field }
 */
export function* sync(action) {
  try {
    const response = yield call(axios.post, 'sync');
    yield put({ type: types.FETCH_SYNC_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.FETCH_SYNC_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_SYNC_REQUEST, sync);
}
