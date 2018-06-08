import { takeLatest, put, call, fork, race, take } from 'redux-saga/effects';
import axios from 'axios';
import containerModel from '../models/container';
import { poll } from '../lib/polling';
import * as types from '../actionTypes';

/**
 * fetchContainers
 * @param {*} action { fqon, environmentId }
 */
export function* fetchContainers(action) {
  try {
    const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/containers` : `${action.fqon}/containers`;
    const response = yield call(axios.get, `${url}?expand=true&embed=apiendpoints`);

    yield put({ type: types.FETCH_CONTAINERS_FULFILLED, payload: response.data, action });
  } catch (e) {
    yield put({ type: types.FETCH_CONTAINERS_REJECTED, payload: e.message });
  }
}

/**
 * fetchContainer
 * @param {*} action { fqon, containerId, entityKey, entityId }
 */
export function* fetchContainer(action) {
  function getContainer() {
    return axios.get(`${action.fqon}/containers/${action.containerId}`);
  }

  function getEnv() {
    const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/env` : `${action.fqon}/env`;
    return axios.get(url);
  }

  // TODO: have meta allow expands so we don't have to do this
  const promises = [getContainer()];
  if (action.entityKey !== 'providers') {
    promises.push(getEnv());
  }

  try {
    const response = yield call(axios.all, promises);
    const payload = { ...response[0].data };
    payload.properties.env = Object.assign(response[1].data, payload.properties.env);

    yield put({ type: types.FETCH_CONTAINER_FULFILLED, payload, action });
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
    const response = yield call(axios.put, `${action.fqon}/containers/${action.containerId}`, action.payload);
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
 * @param {*} action - { fqon, containerId, numInstances, onSuccess }
 */
export function* scaleContainer(action) {
  try {
    yield call(axios.post, `${action.fqon}/containers/${action.containerId}/scale?numInstances=${action.numInstances}`);
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
 * @param {*} action - { fqon, containerId, providerId, onSuccess }
 */
export function* migrateContainer(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/containers/${action.containerId}/migrate?provider=${action.providerId}`);
    // TODO: Workaround since Meta does not return a response on rejection
    if (response) {
      yield put({ type: types.MIGRATE_CONTAINER_FULFILLED, payload: response.data });

      if (typeof action.onSuccess === 'function') {
        action.onSuccess(response.data);
      }
    } else {
      yield put({ type: types.MIGRATE_CONTAINER_REJECTED, payload: 'Unable to Migrate Container' });
    }
  } catch (e) {
    yield put({ type: types.MIGRATE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * promoteContainer
 * @param {*} action - { fqon, containerId, environmentId, onSuccess }
 */
export function* promoteContainer(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/containers/${action.containerId}/promote?target=${action.environmentId}`);
    // TODO: Workaround since Meta does not return a response on rejection
    if (response) {
      yield put({ type: types.PROMOTE_CONTAINER_FULFILLED });

      if (typeof action.onSuccess === 'function') {
        action.onSuccess();
      }
    } else {
      yield put({ type: types.PROMOTE_CONTAINER_REJECTED, payload: 'Unable to Promote Container' });
    }
  } catch (e) {
    yield put({ type: types.PROMOTE_CONTAINER_REJECTED, payload: e.message });
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
      const containerResponse = yield call(axios.get, `${action.fqon}/containers/${response.data[0].id}`);
      yield put({ type: types.FETCH_CONTAINER_FULFILLED, payload: containerResponse.data, action });
    } else {
      yield put({ type: types.FETCH_CONTAINER_FULFILLED, payload: containerModel.get(), action });
    }
  } catch (e) {
    yield put({ type: types.FETCH_CONTAINER_REJECTED, payload: e.message });
  }
}

// Wait for successful response, then fire another request
// Cancel polling on unload
function* watchContainerPoll() {
  while (true) {
    const { action } = yield take(types.FETCH_CONTAINER_FULFILLED);

    const method = action.providerContainer ? fetchProviderContainer : fetchContainer;

    if (action.enablePolling) {
      yield race({
        task: call(poll, method, action),
        cancel: take(types.UNLOAD_CONTAINER),
      });
    }
  }
}

function* watchContainersPoll() {
  while (true) {
    const { action } = yield take(types.FETCH_CONTAINERS_FULFILLED);

    if (action.enablePolling) {
      yield race({
        task: call(poll, fetchContainers, action),
        cancel: take(types.UNLOAD_CONTAINERS),
      });
    }
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
  yield fork(takeLatest, types.PROMOTE_CONTAINER_REQUEST, promoteContainer);
  yield fork(takeLatest, types.FETCH_PROVIDERCONTAINER_REQUEST, fetchProviderContainer);
  yield fork(watchContainerPoll);
  yield fork(watchContainersPoll);
}
