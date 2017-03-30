import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * fetchEnv
 * @param {*} action { fqon, entityId, entityKey }
 */
export function* fetchEnv(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/env` : `${action.fqon}/env`;
  try {
    const response = yield call(axios.get, url);

    yield put({ type: types.FETCH_ENV_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_ENV_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_ENV_REQUEST, fetchEnv);
}

