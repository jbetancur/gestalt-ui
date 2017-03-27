import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * setOrgContext
 * @param {*} action - { fqon }
 */
export function* setOrgContext(action) {
  yield put({ type: types.SET_CURRENT_ORG_CONTEXT_PENDING });

  try {
    const response = yield call(axios.get, action.fqon);
    yield put({ type: types.UPDATE_CURRENT_ORG_CONTEXT, payload: response.data });
  } catch (e) {
    yield put({ type: types.SET_CURRENT_ORG_CONTEXT_REJECTED, payload: e.message });
  }
}

/**
 * setWorkspaceContext
 * @param {*} action - { fqon, workspaceId }
 */
export function* setWorkspaceContext(action) {
  yield put({ type: types.SET_CURRENT_WORKSPACE_CONTEXT_PENDING });

  try {
    const response = yield call(axios.get, `${action.fqon}/workspaces/${action.workspaceId}`);
    yield put({ type: types.UPDATE_CURRENT_WORKSPACE_CONTEXT, payload: response.data });
  } catch (e) {
    yield put({ type: types.SET_CURRENT_WORKSPACE_CONTEXT_REJECTED, payload: e.message });
  }
}

/**
 * setEnvironmentContext - { fqon, environmentId }
 * @param {*} action
 */
export function* setEnvironmentContext(action) {
  yield put({ type: types.SET_CURRENT_ENVIRONMENT_CONTEXT_PENDING });

  try {
    const response = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}`);
    yield put({ type: types.UPDATE_CURRENT_ENVIRONMENT_CONTEXT, payload: response.data });
  } catch (e) {
    yield put({ type: types.SET_CURRENT_ENVIRONMENT_CONTEXT_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.SET_CURRENT_ORG_CONTEXT_REQUEST, setOrgContext);
  yield fork(takeLatest, types.SET_CURRENT_WORKSPACE_CONTEXT_REQUEST, setWorkspaceContext);
  yield fork(takeLatest, types.SET_CURRENT_ENVIRONMENT_CONTEXT_REQUEST, setEnvironmentContext);
}

