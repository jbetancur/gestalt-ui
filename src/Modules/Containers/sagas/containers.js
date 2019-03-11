import { takeLatest, put, call, fork, race, take, cancelled } from 'redux-saga/effects';
import axios from 'axios';
import { get } from 'lodash';
import { LOCATION_CHANGE } from 'connected-react-router';
import { notificationActions } from 'Modules/Notifications';
import { volumeActions } from 'Modules/Volumes';
import { poll, fetchAPI } from 'config/lib/utility';
import {
  FETCH_CONTAINERS_REQUEST,
  FETCH_CONTAINERS_FULFILLED,
  FETCH_CONTAINERS_REJECTED,
  FETCH_CONTAINERS_CANCELLED,
  CREATE_CONTAINERS_REQUEST,
  CREATE_CONTAINERS_FULFILLED,
  CREATE_CONTAINERS_REJECTED,
  FETCH_CONTAINER_REQUEST,
  FETCH_CONTAINER_FULFILLED,
  FETCH_CONTAINER_REJECTED,
  FETCH_CONTAINER_CANCELLED,
  CREATE_CONTAINER_REQUEST,
  CREATE_CONTAINER_FULFILLED,
  CREATE_CONTAINER_REJECTED,
  UPDATE_CONTAINER_REQUEST,
  UPDATE_CONTAINER_FULFILLED,
  UPDATE_CONTAINER_REJECTED,
  DELETE_CONTAINER_REQUEST,
  DELETE_CONTAINER_FULFILLED,
  DELETE_CONTAINER_REJECTED,
  SCALE_CONTAINER_FULFILLED,
  SCALE_CONTAINER_REJECTED,
  MIGRATE_CONTAINER_FULFILLED,
  MIGRATE_CONTAINER_REJECTED,
  PROMOTE_CONTAINER_FULFILLED,
  PROMOTE_CONTAINER_REJECTED,
  UNLOAD_CONTAINER,
  UNLOAD_CONTAINERS,
  SCALE_CONTAINER_REQUEST,
  MIGRATE_CONTAINER_REQUEST,
  PROMOTE_CONTAINER_REQUEST,
  INIT_CONTAINERCREATE_FULFILLED,
  INIT_CONTAINEREDIT_FULFILLED,
  INIT_CONTAINEREDIT_CANCELLED,
} from '../actionTypes';
import { setSelectedProvider } from '../actions';

/**
 * fetchContainers
 * @param {*} action { fqon, environmentId }
 */
export function* fetchContainers(action) {
  try {
    const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/containers` : `${action.fqon}/containers`;
    const { data } = yield call(fetchAPI, `${url}?expand=true&embed=apiendpoints&embed=provider`);

    yield put({ type: FETCH_CONTAINERS_FULFILLED, payload: data, action });
  } catch (e) {
    yield put({ type: FETCH_CONTAINERS_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: FETCH_CONTAINERS_CANCELLED });
    }
  }
}

/**
 * fetchContainer
 * @param {*} action { fqon, containerId, entityKey, entityId }
 */
export function* fetchContainer(action) {
  const key = action.isJob ? 'jobs' : 'containers';

  function getContainer() {
    return axios.get(`${action.fqon}/${key}/${action.containerId}?embed=provider&embed=volumes`);
  }

  function getEnv() {
    const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/env` : `${action.fqon}/env`;
    return axios.get(url);
  }

  // TODO: have meta allow expands so we don't have to do this
  const promises = [getContainer()];
  if (action.entityKey !== 'providers' && !action.isJob) {
    promises.push(getEnv());
  }

  try {
    const [containerResponse, envResponse] = yield call(axios.all, promises);
    const payload = {
      container: containerResponse.data,
      inheritedEnv: (envResponse && envResponse.data) || {},
    };

    yield put(setSelectedProvider(containerResponse.data.properties.provider));
    yield put({ type: FETCH_CONTAINER_FULFILLED, payload, action });
  } catch (e) {
    yield put({ type: FETCH_CONTAINER_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: FETCH_CONTAINER_CANCELLED });
    }
  }
}

/**
 * createContainer
 * @param {*} action - { fqon, environmentId, payload, onSuccess {returns response.data} }
 */
export function* createContainer(action) {
  try {
    const { data } = yield call(axios.post, `${action.fqon}/environments/${action.environmentId}/containers?embed=provider&embed=volumes`, action.payload);

    yield put({ type: CREATE_CONTAINER_FULFILLED, payload: data });
    yield put(notificationActions.addNotification({ message: `${data.name} Container created` }));
    yield put(volumeActions.setVolumes(get(data, 'properties.volumes') || []));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(data);
    }
  } catch (e) {
    yield put({ type: CREATE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * createContainerFromListing
 * @param {*} action - { fqon, environmentId, payload, onSuccess {returns response.data} }
 */
export function* createContainerFromListing(action) {
  try {
    const { data } = yield call(axios.post, `${action.fqon}/environments/${action.environmentId}/containers?embed=provider&embed=volumes`, action.payload);

    yield put({ type: CREATE_CONTAINERS_FULFILLED, payload: data, updateState: action.updateState });
    yield put(notificationActions.addNotification({ message: `${data.name} Container created` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(data);
    }
  } catch (e) {
    yield put({ type: CREATE_CONTAINERS_REJECTED, payload: e.message });
  }
}

/**
 * updateContainer
 * @param {*} action - { fqon, containerId, payload, onSuccess {returns response.data}  }
 */
export function* updateContainer(action) {
  try {
    const { data } = yield call(axios.put, `${action.fqon}/containers/${action.containerId}?embed=provider&embed=volumes`, action.payload);
    // On a put resource we still need to pull in the inheritied envs so we can reconcile them
    const envResponse = yield call(axios.get, `${data.properties.parent.href}/env`);

    const payload = {
      container: data,
      inheritedEnv: envResponse.data,
    };

    yield put({ type: UPDATE_CONTAINER_FULFILLED, payload });
    yield put(notificationActions.addNotification({ message: `${data.name} Container updated` }));
    yield put(volumeActions.setVolumes(get(data, 'properties.volumes') || []));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(data);
    }
  } catch (e) {
    yield put({ type: UPDATE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * deleteContainer
 * @param {*} action - { fqon, containerId, onSuccess }
 */
export function* deleteContainer(action) {
  const isJob = action.resource.resource_type === 'Gestalt::Resource::Job';
  const label = isJob
    ? 'Job'
    : 'Container';
  const key = isJob
    ? 'jobs'
    : 'containers';

  try {
    yield call(axios.delete, `${action.fqon}/${key}/${action.resource.id}?force=${action.force || false}`);
    yield put({ type: DELETE_CONTAINER_FULFILLED, payload: action.resource });
    yield put(notificationActions.addNotification({ message: `${action.resource.name} ${label} destroyed` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: DELETE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * scaleContainer
 * @param {*} action - { fqon, containerId, numInstances, onSuccess }
 */
export function* scaleContainer(action) {
  try {
    yield call(axios.post, `${action.fqon}/containers/${action.containerId}/scale?numInstances=${action.numInstances}&embed=provider&embed=volumes`);
    yield put({ type: SCALE_CONTAINER_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: SCALE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * migrateContainer
 * @param {*} action - { fqon, containerId, providerId, onSuccess }
 */
export function* migrateContainer(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/containers/${action.containerId}/migrate?provider=${action.providerId}&embed=provider&embed=volumes`);
    // TODO: Workaround since Meta does not return a response on rejection
    if (response) {
      const payload = response.data;
      yield put({ type: MIGRATE_CONTAINER_FULFILLED, payload });

      if (typeof action.onSuccess === 'function') {
        action.onSuccess(response.data);
      }
    } else {
      yield put({ type: MIGRATE_CONTAINER_REJECTED, payload: 'Unable to Migrate Container' });
    }
  } catch (e) {
    yield put({ type: MIGRATE_CONTAINER_REJECTED, payload: e.message });
  }
}

/**
 * promoteContainer
 * @param {*} action - { fqon, containerId, environmentId, onSuccess }
 */
export function* promoteContainer(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/containers/${action.containerId}/promote?target=${action.environmentId}&embed=provider&embed=volumes`);
    // TODO: Workaround since Meta does not return a response on rejection
    if (response) {
      yield put({ type: PROMOTE_CONTAINER_FULFILLED });

      if (typeof action.onSuccess === 'function') {
        action.onSuccess();
      }
    } else {
      yield put({ type: PROMOTE_CONTAINER_REJECTED, payload: 'Unable to Promote Container' });
    }
  } catch (e) {
    yield put({ type: PROMOTE_CONTAINER_REJECTED, payload: e.message });
  }
}

/* Note: to deal with RACE conditions when a user is navigating too quickly and the CONTAINER_FULLFILLED (starts poll)
 channel happens after the UNLOAD_CONTAINERS (cancels poll), we need a failsafe to stop polling as soon as possible.
 Here we use LOCATION_CHANGE so on any subsequent nav the polling is cancelled and the container state unloaded again.
 This is a stop gap until we have real events that negate short polling */
function* watchContainerPoll() {
  while (true) {
    const { action } = yield take(INIT_CONTAINEREDIT_FULFILLED);

    if (action.enablePolling) {
      yield race({
        task: call(poll, fetchContainer, action),
        cancel: take(UNLOAD_CONTAINER),
        cancelled: take(INIT_CONTAINEREDIT_CANCELLED),
        cancelled2: take(FETCH_CONTAINER_CANCELLED),
        cancelDelete: take(DELETE_CONTAINER_FULFILLED), // cancel poll on delete
        cancelRoute: take(LOCATION_CHANGE),
      });
    }
  }
}

/* Note: to deal with RACE conditions when a user is navigating too quickly and the CONTAINER_FULLFILLED (starts poll)
 channel happens after the UNLOAD_CONTAINERS (cancels poll), we need a failsafe to stop polling as soon as possible.
 Here we use LOCATION_CHANGE so on any subsequent nav the polling is cancelled and the container state unloaded again.
 This is a stop gap until we have real events that negate short polling */
function* watchContainersPoll() {
  while (true) {
    const { action } = yield take(FETCH_CONTAINERS_FULFILLED);

    if (action.enablePolling) {
      yield race({
        task: call(poll, fetchContainers, action),
        cancel: take(UNLOAD_CONTAINERS),
        cancelWhenCreateMode: take(INIT_CONTAINERCREATE_FULFILLED),
        cancelWhenEditMode: take(INIT_CONTAINEREDIT_FULFILLED),
        cancelled: take(FETCH_CONTAINERS_CANCELLED),
        cancelRoute: take(LOCATION_CHANGE),
      });
    }
  }
}

// Kicks off the Workflow but can be cancelled by any event in the race
// also prevents polling mid request e.g. nav changes
export function* watchContainerRequestWorkflow() {
  yield takeLatest(FETCH_CONTAINER_REQUEST, function* raceContainerReq(...args) {
    yield race({
      task: call(fetchContainer, ...args),
      cancel: take(UNLOAD_CONTAINER),
      cancelled: take(FETCH_CONTAINER_CANCELLED),
    });
  });
}

// Kicks off the Workflow but can be cancelled by any event in the race
// also prevents polling mid request e.g. nav changes
export function* watchContainersRequestWorkflow() {
  yield takeLatest(FETCH_CONTAINERS_REQUEST, function* raceContainersReq(...args) {
    yield race({
      task: call(fetchContainers, ...args),
      cancel: take(UNLOAD_CONTAINERS),
      cancelled: take(FETCH_CONTAINERS_CANCELLED),
    });
  });
}

// Watchers
export default function* () {
  yield fork(watchContainersRequestWorkflow);
  yield fork(watchContainerRequestWorkflow);
  yield takeLatest(CREATE_CONTAINER_REQUEST, createContainer);
  yield takeLatest(CREATE_CONTAINERS_REQUEST, createContainerFromListing);
  yield takeLatest(UPDATE_CONTAINER_REQUEST, updateContainer);
  yield takeLatest(DELETE_CONTAINER_REQUEST, deleteContainer);
  yield takeLatest(SCALE_CONTAINER_REQUEST, scaleContainer);
  yield takeLatest(MIGRATE_CONTAINER_REQUEST, migrateContainer);
  yield takeLatest(PROMOTE_CONTAINER_REQUEST, promoteContainer);
  yield fork(watchContainerPoll);
  yield fork(watchContainersPoll);
}
