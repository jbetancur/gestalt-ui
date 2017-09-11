import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * fetchSecrets
 * @param {Object} action { fqon, environmentId }
 */
export function* fetchSecrets(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}/secrets?expand=true`);

    yield put({ type: types.FETCH_SECRETS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_SECRETS_REJECTED, payload: e.message });
  }
}

/**
 * fetchSecretsDropDown
 * @param {Object} action { fqon, environmentId }
 */
export function* fetchSecretsDropDown(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}/secrets`);

    if (!response.data.length) {
      yield put({ type: types.FETCH_SECRETS_DROPDOWN_FULFILLED, payload: [{ id: '', name: 'No Available Secrets' }] });
    } else {
      yield put({ type: types.FETCH_SECRETS_DROPDOWN_FULFILLED, payload: response.data });
    }
  } catch (e) {
    yield put({ type: types.FETCH_SECRETS_DROPDOWN_REJECTED, payload: e.message });
  }
}

/**
 * fetchSecret
 * @param {Object} action { fqon, secretId, environmentId }
 */
export function* fetchSecret(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/secrets/${action.secretId}`);

    yield put({ type: types.FETCH_SECRET_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_SECRET_REJECTED, payload: e.message });
  }
}

/**
 * createSecret
 * @param {Object} action - { fqon, environmentId, payload, onSuccess {returns response.data} }
 */
export function* createSecret(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/environments/${action.environmentId}/secrets`, action.payload);
    yield put({ type: types.CREATE_SECRET_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_SECRET_REJECTED, payload: e.message });
  }
}

/**
 * udpateSecret
 * @param {Object} action - { fqon, secretId, payload, onSuccess {returns response.data}  }
 */
export function* updateSecret(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/secrets/${action.secretId}`, action.payload);
    yield put({ type: types.UPDATE_SECRET_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_SECRET_REJECTED, payload: e.message });
  }
}

/**
 * deleteSecret
 * @param {Object} action - { fqon, secretId, onSuccess }
 */
export function* deleteSecret(action) {
  try {
    yield call(axios.delete, `${action.fqon}/secrets/${action.secretId}`);
    yield put({ type: types.DELETE_SECRET_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_SECRET_REJECTED, payload: e.message });
  }
}

/**
 * deleteSecrets
 * @param {Object} action - { fqon, secretIds, onSuccess }
 */
export function* deleteSecrets(action) {
  try {
    const all = action.secretIds.map(id => axios.delete(`${action.fqon}/secrets/${id}?force=true`));

    yield call(axios.all, all);
    yield put({ type: types.DELETE_SECRET_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_SECRET_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_SECRETS_REQUEST, fetchSecrets);
  yield fork(takeLatest, types.FETCH_SECRETS_DROPDOWN_REQUEST, fetchSecretsDropDown);
  yield fork(takeLatest, types.FETCH_SECRET_REQUEST, fetchSecret);
  yield fork(takeLatest, types.CREATE_SECRET_REQUEST, createSecret);
  yield fork(takeLatest, types.UPDATE_SECRET_REQUEST, updateSecret);
  yield fork(takeLatest, types.DELETE_SECRET_REQUEST, deleteSecret);
  yield fork(takeLatest, types.DELETE_SECRETS_REQUEST, deleteSecrets);
}
