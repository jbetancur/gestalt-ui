import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { merge, orderBy } from 'lodash';
import containerModel from '../models/container';
import * as types from '../actionTypes';

/**
 * fetchContainers
 * @param {*} action { fqon, environmentId }
 */
export function* fetchContainers(action) {
  try {
    const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/containers` : `${action.fqon}/containers`;
    const containersResponse = yield call(axios.get, `${url}?expand=true`);

    const containers = [];
    // this is a niche case with generators and arrays where we need an imperative loop to collate public_url and transform containers/endpoints
    // eslint-disable-next-line
    for (const container of containersResponse.data) {
      const apiEndpoints = [];
      const apieEndpointsResponse = yield call(axios.get, `${action.fqon}/apiendpoints?expand=true&implementation_type=container&implementation_id=${container.id}`);
      // eslint-disable-next-line
      for (const endpoint of apieEndpointsResponse.data) {
        const kongProviderResponse = yield call(axios.get, `${action.fqon}/providers/${endpoint.properties.location_id}`);
        apiEndpoints.push(merge(endpoint, { properties: { public_url: `${kongProviderResponse.data.properties.config.external_protocol}://${kongProviderResponse.data.properties.config.env.public.PUBLIC_URL_VHOST_0}/${endpoint.properties.parent.name}${endpoint.properties.resource}` } }));
      }
      containers.push(merge(container, { properties: { apiEndpoints } }));
    }
    const payload = orderBy(containers, 'name', 'asc');
    yield put({ type: types.FETCH_CONTAINERS_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_CONTAINERS_REJECTED, payload: e.message });
  }
}

/**
 * fetchContainersDropDown
 * @param {*} action { fqon, environmentId }
 */
export function* fetchContainersDropDown(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}/containers?expand=true`);

    if (!response.data.length) {
      yield put({ type: types.FETCH_CONTAINERS_DROPDOWN_FULFILLED, payload: [{ id: '', name: 'No Available Containers' }] });
    } else {
      yield put({ type: types.FETCH_CONTAINERS_DROPDOWN_FULFILLED, payload: response.data });
    }
  } catch (e) {
    yield put({ type: types.FETCH_CONTAINERS_DROPDOWN_REJECTED, payload: e.message });
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
      yield put({ type: types.MIGRATE_CONTAINER_FULFILLED });

      if (typeof action.onSuccess === 'function') {
        action.onSuccess();
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
      yield put({ type: types.FETCH_CONTAINER_FULFILLED, payload: containerResponse.data });
    } else {
      yield put({ type: types.FETCH_CONTAINER_FULFILLED, payload: containerModel.get() });
    }
  } catch (e) {
    yield put({ type: types.FETCH_CONTAINER_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_CONTAINERS_REQUEST, fetchContainers);
  yield fork(takeLatest, types.FETCH_CONTAINERS_DROPDOWN_REQUEST, fetchContainersDropDown);
  yield fork(takeLatest, types.FETCH_CONTAINER_REQUEST, fetchContainer);
  yield fork(takeLatest, types.CREATE_CONTAINER_REQUEST, createContainer);
  yield fork(takeLatest, types.UPDATE_CONTAINER_REQUEST, updateContainer);
  yield fork(takeLatest, types.DELETE_CONTAINER_REQUEST, deleteContainer);
  yield fork(takeLatest, types.SCALE_CONTAINER_REQUEST, scaleContainer);
  yield fork(takeLatest, types.MIGRATE_CONTAINER_REQUEST, migrateContainer);
  yield fork(takeLatest, types.PROMOTE_CONTAINER_REQUEST, promoteContainer);
  yield fork(takeLatest, types.FETCH_PROVIDER_CONTAINER_REQUEST, fetchProviderContainer);
}
