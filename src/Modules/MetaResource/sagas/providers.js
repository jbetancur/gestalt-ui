import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { flatten, merge, orderBy } from 'lodash';
import providerModel from '../models/provider';
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
    const payload = orderBy(response.data, 'name', 'asc');

    yield put({ type: types.FETCH_PROVIDERS_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_PROVIDERS_REJECTED, payload: e.message });
  }
}

/**
 * fetchProvidersByType
 * @param {*} action { fqon, entityKey, entityId, providerType, expand }
 */
export function* fetchProvidersByType(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/providers` : `${action.fqon}/providers`;
  const urlHasType = action.providerType ? `${url}?expand=true&type=${action.providerType}` : `${url}?expand=${action.expand}`;

  try {
    const response = yield call(axios.get, urlHasType);

    if (!response.data.length) {
      yield put({ type: types.FETCH_PROVIDERS_BYTYPE_FULFILLED, payload: [providerModel.get({ id: '', name: 'No Available Providers' })] });
    } else {
      yield put({ type: types.FETCH_PROVIDERS_BYTYPE_FULFILLED, payload: response.data });
    }
  } catch (e) {
    yield put({ type: types.FETCH_PROVIDERS_BYTYPE_REJECTED, payload: e.message });
  }
}

/**
 * fetchProviderKongsByGateway
 * @param {*} action { fqon, entityKey, entityId, providerType }
 */
export function* fetchProviderKongsByGateway(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/providers` : `${action.fqon}/providers`;

  try {
    const responseGWs = yield call(axios.get, `${url}?expand=true&type=GatewayManager`);
    const responseKongs = yield call(axios.get, `${url}?expand=true&type=Kong`);
    const gatewayProviders = responseKongs.data.map(kong => responseGWs.data.map(gw => gw.properties.linked_providers.find(lp => lp.id === kong.id) && gw));
    const payload = responseKongs.data.map(provider => merge(provider, { properties: { gatewayProvider: flatten(gatewayProviders)[0] } }));

    if (!payload.length) {
      yield put({ type: types.FETCH_PROVIDERS_KONG_GATEWAY_FULFILLED, payload: [{ id: '', name: 'No Available Providers' }] });
    } else {
      yield put({ type: types.FETCH_PROVIDERS_KONG_GATEWAY_FULFILLED, payload });
    }
  } catch (e) {
    yield put({ type: types.FETCH_PROVIDERS_KONG_GATEWAY_REJECTED, payload: e.message });
  }
}

/**
 * fetchExecutors
 * @param {*} action { fqon, entityKey, entityId, executorType }
 */
export function* fetchExecutors(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/providers` : `${action.fqon}/providers`;

  try {
    const response = yield call(axios.get, `${url}?expand=true&type=${action.executorType}`);

    if (!response.data.length) {
      yield put({ type: types.FETCH_EXECUTORS_FULFILLED, payload: [{ id: '', name: 'No Available Executors' }] });
    } else {
      const payload = response.data.map(executor => ({ name: `${executor.name} (${executor.resource_type.split(/[::]+/).pop()})`, runtime: executor.properties.config.env.public.RUNTIME }));
      yield put({ type: types.FETCH_EXECUTORS_FULFILLED, payload, });
    }
  } catch (e) {
    yield put({ type: types.FETCH_EXECUTORS_REJECTED, payload: e.message });
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
 * deleteAPI
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
    yield put({ type: types.DELETE_PROVIDER_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_PROVIDER_REJECTED, payload: e.message });
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
  yield fork(takeLatest, types.FETCH_PROVIDERS_BYTYPE_REQUEST, fetchProvidersByType);
  yield fork(takeLatest, types.FETCH_PROVIDERS_KONG_GATEWAY_REQUEST, fetchProviderKongsByGateway);
  yield fork(takeLatest, types.FETCH_EXECUTORS_REQUEST, fetchExecutors);
  yield fork(takeLatest, types.FETCH_PROVIDER_REQUEST, fetchProvider);
  yield fork(takeLatest, types.CREATE_PROVIDER_REQUEST, createProvider);
  yield fork(takeLatest, types.UPDATE_PROVIDER_REQUEST, updateProvider);
  yield fork(takeLatest, types.DELETE_PROVIDER_REQUEST, deleteProvider);
  yield fork(takeLatest, types.DELETE_PROVIDERS_REQUEST, deleteProviders);
  yield fork(takeLatest, types.REDEPLOY_PROVIDER_REQUEST, redeployProvider);
}
