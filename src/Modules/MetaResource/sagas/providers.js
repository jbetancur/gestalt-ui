import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * redeployProvider
 * @param {*} action - { fqon, providerId, onSuccess }
 */
export function* redeployProvider(action) {
  try {
    yield call(axios.post, `${action.fqon}/providers/${action.id}/redeploy`);
    yield put({ type: types.REDEPLOY_PROVIDER_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.REDEPLOY_PROVIDER_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.REDEPLOY_PROVIDER_REQUEST, redeployProvider);
}
