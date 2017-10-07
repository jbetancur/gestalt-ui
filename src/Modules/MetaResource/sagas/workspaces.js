import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * fetchWorkspaces
 * @param {*} action { fqon }
 */
export function* fetchWorkspaces(action) {
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
  try {
    const response = yield call(axios.get, `${action.fqon}/workspaces/${action.workspaceId}`);
    yield put({ type: types.FETCH_WORKSPACE_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_WORKSPACE_REJECTED, payload: e.message });
  }
}

/**
 * createWorkspace
 * @param {*} action - { fqon, payload, onSuccess {returns response.data} }
 */
export function* createWorkspace(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/workspaces`, action.payload);
    yield put({ type: types.CREATE_WORKSPACE_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_WORKSPACE_REJECTED, payload: e.message });
  }
}

/**
 * updateWorkspace
 * @param {*} action - { fqon, payload, onSuccess {returns response.data}  }
 */
export function* updateWorkspace(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/workspaces/${action.workspaceId}`, action.payload);
    yield put({ type: types.UPDATE_WORKSPACE_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_WORKSPACE_REJECTED, payload: e.message });
  }
}

/**
 * deleteWorkspace
 * @param {*} action - { fqon, onSuccess }
 */
export function* deleteWorkspace(action) {
  try {
    yield call(axios.delete, `${action.fqon}/workspaces/${action.workspaceId}?force=true`);
    yield put({ type: types.DELETE_WORKSPACE_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_WORKSPACE_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_WORKSPACES_REQUEST, fetchWorkspaces);
  yield fork(takeLatest, types.FETCH_WORKSPACE_REQUEST, fetchWorkspace);
  yield fork(takeLatest, types.CREATE_WORKSPACE_REQUEST, createWorkspace);
  yield fork(takeLatest, types.UPDATE_WORKSPACE_REQUEST, updateWorkspace);
  yield fork(takeLatest, types.DELETE_WORKSPACE_REQUEST, deleteWorkspace);
}
