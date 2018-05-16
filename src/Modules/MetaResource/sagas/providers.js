import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { merge } from 'lodash';
import * as types from '../actionTypes';


function fixProperties(data) {
  const payload = { ...data };
  // TODO: providers such as kubernetes do not have this field
  // May split out providers types into their own respective Modules/forms
  if (!payload.properties.config) {
    payload.properties.config = {};
  }

  if (payload.properties.config && !payload.properties.config.env) {
    payload.properties.config = merge(payload.properties.config, { env: { public: {}, private: {} } });
  }

  if (!payload.properties.linked_providers) {
    payload.properties.linked_providers = [];
  }

  return payload;
}

/**
 * fetchProviders
 * @param {*} action { fqon, environmentId }
 */
export function* fetchProviders(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/providers` : `${action.fqon}/providers`;
  try {
    const response = yield call(axios.get, `${url}?expand=true`);

    yield put({ type: types.FETCH_PROVIDERS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_PROVIDERS_REJECTED, payload: e.message });
  }
}

/**
 * fetchProvider
 * @param {*} action { fqon, providerId }
 */
export function* fetchProvider(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/providers/${action.providerId}`);

    yield put({ type: types.FETCH_PROVIDER_FULFILLED, payload: fixProperties(response.data) });
  } catch (e) {
    yield put({ type: types.FETCH_PROVIDER_REJECTED, payload: e.message });
  }
}

/**
 * createProvider
 * @param {*} action - { fqon, entityId, entityKey, payload, onSuccess {returns response.data} }
 */
export function* createProvider(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/providers` : `${action.fqon}/providers`;

  try {
    const response = yield call(axios.post, url, action.payload);
    yield put({ type: types.CREATE_PROVIDER_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_PROVIDER_REJECTED, payload: e.message });
  }
}

/**
 * updateProvider
 * @param {*} action - { fqon, providerId, payload, onSuccess {returns response.data}  }
 */
export function* updateProvider(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/providers/${action.providerId}`, action.payload);
    yield put({ type: types.UPDATE_PROVIDER_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_PROVIDER_REJECTED, payload: e.message });
  }
}

/**
 * deleteProvider
 * @param {*} action - { fqon, providerId, onSuccess }
 */
export function* deleteProvider(action) {
  try {
    yield call(axios.delete, `${action.fqon}/providers/${action.providerId}?force=true`);
    yield put({ type: types.DELETE_PROVIDER_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_PROVIDER_REJECTED, payload: e.message });
  }
}

/**
 * deleteProviders
 * @param {*} action - { fqon, providerIds, onSuccess }
 */
export function* deleteProviders(action) {
  try {
    const all = action.providerIds.map(id => axios.delete(`${action.fqon}/providers/${id}?force=true`));

    yield call(axios.all, all);
    yield put({ type: types.DELETE_PROVIDERS_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_PROVIDERS_REJECTED, payload: e.message });
  }
}

/**
 * redeployProvider
 * @param {*} action - { fqon, providerId, onSuccess }
 */
export function* redeployProvider(action) {
  try {
    yield call(axios.post, `${action.fqon}/providers/${action.providerId}/redeploy`);
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
  yield fork(takeLatest, types.FETCH_PROVIDERS_REQUEST, fetchProviders);
  yield fork(takeLatest, types.FETCH_PROVIDER_REQUEST, fetchProvider);
  yield fork(takeLatest, types.CREATE_PROVIDER_REQUEST, createProvider);
  yield fork(takeLatest, types.UPDATE_PROVIDER_REQUEST, updateProvider);
  yield fork(takeLatest, types.DELETE_PROVIDER_REQUEST, deleteProvider);
  yield fork(takeLatest, types.DELETE_PROVIDERS_REQUEST, deleteProviders);
  yield fork(takeLatest, types.REDEPLOY_PROVIDER_REQUEST, redeployProvider);
}
