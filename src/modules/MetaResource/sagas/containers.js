import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * fetchContainers
 * @param {*} action { fqon, environmentId }
 */
export function* fetchContainers(action) {
  const url = action.environmentId ? `${action.fqon}/environments/${action.environmentId}/containers` : `${action.fqon}/containers`;

  try {
    const response = yield call(axios.get, `${url}?expand=true`);

    yield put({ type: types.FETCH_CONTAINERS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_CONTAINERS_REJECTED, payload: e.message });
  }
}

/**
 * fetchContainer
 * @param {*} action { fqon, containerId, environmentId }
 */
export function* fetchContainer(action) {
  function getContainer() {
    return axios.get(`${action.fqon}/containers/${action.containerId}`);
  }

  function getEnv() {
    return axios.get(`${action.fqon}/environments/${action.environmentId}/env`);
  }

  try {
    const response = yield call(axios.all, [getContainer(), getEnv()]);
    const payload = { ...response[0].data };
    payload.properties.env = Object.assign(payload.properties.env, response[1].data);

    yield put({ type: types.FETCH_CONTAINER_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * createContainer
 * @param {*} action - { fqon, environmentId, payload, onSuccess {returns response.data} }
 */
export function* createContainer(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/environments/${action.environmentId}/containers`, action.payload);
    yield put({ type: types.CREATE_CONTAINER_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * updateContainer
 * @param {*} action - { fqon, containerId, payload, onSuccess {returns response.data}  }
 */
export function* updateContainer(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/containers/${action.containerId}`, action.payload);
    yield put({ type: types.UPDATE_CONTAINER_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * deleteContainer
 * @param {*} action - { fqon, containerId, onSuccess }
 */
export function* deleteContainer(action) {
  try {
    yield call(axios.delete, `${action.fqon}/containers/${action.containerId}?force=true`);
    yield put({ type: types.DELETE_CONTAINER_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * scaleContainer
 * @param {*} action - { fqon, environmentId, containerId, numInstances, onSuccess }
 */
export function* scaleContainer(action) {
  try {
    yield call(axios.post, `${action.fqon}/environments/${action.environmentId}/containers/${action.containerId}/scale?numInstances=${action.numInstances}`);
    yield put({ type: types.SCALE_CONTAINER_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.SCALE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * migrateContainer
 * @param {*} action - { fqon, environmentId, containerId, providerId, onSuccess }
 */
export function* migrateContainer(action) {
  try {
    yield call(axios.post, `${action.fqon}/environments/${action.environmentId}/containers/${action.containerId}/migrate?provider=${action.providerId}`);
    yield put({ type: types.MIGRATE_CONTAINER_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.MIGRATE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * fetchProviderContainer
 * @param {*} action - { fqon, providerId }
 */
export function* fetchProviderContainer(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/providers/${action.providerId}/containers`);

    if (response.data.length) {
      const containerResponse = yield call(axios.get, `${action.fqon}/providers/${action.providerId}/containers/${response.data[0].id}`);
      yield put({ type: types.FETCH_CONTAINER_FULFILLED, payload: containerResponse.data });
    } else {
      yield put({ type: types.FETCH_CONTAINER_FULFILLED });
    }
  } catch (e) {
    yield put({ type: types.FETCH_CONTAINER_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_CONTAINERS_REQUEST, fetchContainers);
  yield fork(takeLatest, types.FETCH_CONTAINER_REQUEST, fetchContainer);
  yield fork(takeLatest, types.CREATE_CONTAINER_REQUEST, createContainer);
  yield fork(takeLatest, types.UPDATE_CONTAINER_REQUEST, updateContainer);
  yield fork(takeLatest, types.DELETE_CONTAINER_REQUEST, deleteContainer);
  yield fork(takeLatest, types.SCALE_CONTAINER_REQUEST, scaleContainer);
  yield fork(takeLatest, types.MIGRATE_CONTAINER_REQUEST, migrateContainer);
  yield fork(takeLatest, types.FETCH_PROVIDER_CONTAINER_REQUEST, fetchProviderContainer);
}
