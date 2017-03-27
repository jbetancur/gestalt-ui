import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * fetchEnvironments
 * @param {*} action { fqon, workspaceId }
 */
export function* fetchEnvironments(action) {
  const url = action.workspaceId ? `${action.fqon}/workspaces/${action.workspaceId}/environments` : `${action.fqon}/environments`;
  yield put({ type: types.FETCH_ENVIRONMENTS_PENDING });

  try {
    const response = yield call(axios.get, `${url}?expand=true`);
    yield put({ type: types.FETCH_ENVIRONMENTS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_ENVIRONMENTS_REJECTED, payload: e.message });
  }
}

/**
 * fetchEnvironment
 * @param {*} action { fqon, environmentId }
 */
export function* fetchEnvironment(action) {
  yield put({ type: types.FETCH_ENVIRONMENT_PENDING });

  try {
    const response = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}`);

    yield put({ type: types.FETCH_ENVIRONMENT_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_ENVIRONMENT_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_ENVIRONMENTS_REQUEST, fetchEnvironments);
  yield fork(takeLatest, types.FETCH_ENVIRONMENT_REQUEST, fetchEnvironment);
}

