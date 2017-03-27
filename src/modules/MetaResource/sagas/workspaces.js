import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * fetchWorkspaces
 * @param {*} action { fqon }
 */
export function* fetchWorkspaces(action) {
  yield put({ type: types.FETCH_WORKSPACES_PENDING });

  try {
    const response = yield call(axios.get, `${action.fqon}/workspaces?expand=true`);
    yield put({ type: types.FETCH_WORKSPACES_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_WORKSPACES_REJECTED, payload: e.message });
  }
}

/**
 * fetchWorkspace
 * @param {*} action { fqon, workspaceId }
 */
export function* fetchWorkspace(action) {
  yield put({ type: types.FETCH_WORKSPACE_PENDING });

  try {
    const response = yield call(axios.get, `${action.fqon}/workspaces/${action.workspaceId}`);
    yield put({ type: types.FETCH_WORKSPACE_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_WORKSPACE_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_WORKSPACES_REQUEST, fetchWorkspaces);
  yield fork(takeLatest, types.FETCH_WORKSPACE_REQUEST, fetchWorkspace);
}
