import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * fetchEnvironments
 * @param {*} action { fqon, workspaceId }
 */
export function* fetchEnvironments(action) {
  try {
    const url = action.workspaceId ? `${action.fqon}/workspaces/${action.workspaceId}/environments` : `${action.fqon}/environments`;
    const response = yield call(axios.get, `${url}?expand=true`);

    const payload = response.data.filter(env => env.properties.workspace);

    yield put({ type: types.FETCH_ENVIRONMENTS_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_ENVIRONMENTS_REJECTED, payload: e.message });
  }
}

/**
 * fetchEnvironment
 * @param {*} action { fqon, environmentId }
 */
export function* fetchEnvironment(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}`);

    yield put({ type: types.FETCH_ENVIRONMENT_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_ENVIRONMENT_REJECTED, payload: e.message });
  }
}

/**
 * createEnvironment
 * @param {*} action - { fqon, payload, onSuccess {returns response.data} }
 */
export function* createEnvironment(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/workspaces/${action.workspaceId}/environments`, action.payload);
    yield put({ type: types.CREATE_ENVIRONMENT_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_ENVIRONMENT_REJECTED, payload: e.message });
  }
}

/**
 * updateEnvironment
 * @param {*} action - { fqon, payload, onSuccess {returns response.data}  }
 */
export function* updateEnvironment(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/environments/${action.environmentId}`, action.payload);
    yield put({ type: types.UPDATE_ENVIRONMENT_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_ENVIRONMENT_REJECTED, payload: e.message });
  }
}

/**
 * deleteEnviroment
 * @param {*} action - { fqon, onSuccess }
 */
export function* deleteEnvironment(action) {
  try {
    yield call(axios.delete, `${action.fqon}/environments/${action.environmentId}?force=true`);
    yield put({ type: types.DELETE_ENVIRONMENT_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_ENVIRONMENT_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_ENVIRONMENTS_REQUEST, fetchEnvironments);
  yield fork(takeLatest, types.FETCH_ENVIRONMENT_REQUEST, fetchEnvironment);
  yield fork(takeLatest, types.CREATE_ENVIRONMENT_REQUEST, createEnvironment);
  yield fork(takeLatest, types.UPDATE_ENVIRONMENT_REQUEST, updateEnvironment);
  yield fork(takeLatest, types.DELETE_ENVIRONMENT_REQUEST, deleteEnvironment);
}
