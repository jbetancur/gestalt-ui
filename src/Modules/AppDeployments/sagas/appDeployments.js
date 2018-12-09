import { takeLatest, put, call, fork, cancelled, take, select } from 'redux-saga/effects';
import axios from 'axios';
import { notificationActions } from 'Modules/Notifications';
import { fetchAPI } from 'config/lib/utility';
import {
  FETCH_APPDEPLOYMENTS_REQUEST,
  FETCH_APPDEPLOYMENTS_FULFILLED,
  FETCH_APPDEPLOYMENTS_REJECTED,
  FETCH_APPDEPLOYMENTS_CANCELLED,
  CREATE_APPDEPLOYMENT_REQUEST,
  CREATE_APPDEPLOYMENT_FULFILLED,
  CREATE_APPDEPLOYMENT_REJECTED,
  // UPDATE_APPDEPLOYMENT_REQUEST,
  // UPDATE_APPDEPLOYMENT_FULFILLED,
  // UPDATE_APPDEPLOYMENT_REJECTED,
  DELETE_APPDEPLOYMENTS_REQUEST,
  DELETE_APPDEPLOYMENT_REQUEST,
  DELETE_APPDEPLOYMENT_FULFILLED,
  DELETE_APPDEPLOYMENT_REJECTED,
  INIT_APPDEPLOYMENTCREATE_REQUEST,
  INIT_APPDEPLOYMENTCREATE_FULFILLED,
  INIT_APPDEPLOYMENTCREATE_REJECTED,
  INIT_APPDEPLOYMENTCREATE_CANCELLED,
} from '../constants';
import { FETCH_CONTEXT_FULFILLED } from '../../Hierarchy/constants';

/**
 * fetchAppDeployments
 */
export function* fetchAppDeployments() {
  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);

    const { data } = yield call(fetchAPI, `${environment.org.properties.fqon}/environments/${environment.id}/appdeployments?expand=true`);

    yield put({ type: FETCH_APPDEPLOYMENTS_FULFILLED, payload: data });
  } catch (e) {
    yield put({ type: FETCH_APPDEPLOYMENTS_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: FETCH_APPDEPLOYMENTS_CANCELLED });
    }
  }
}

/**
 * createAppDeployment
 * @param {*} action - { providerId, namepsace, releaseName, payload, onSuccess {returns response.data} }
 */
export function* createAppDeployment(action) {
  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);
    const { data } = yield call(
      axios.post,
      `${environment.org.properties.fqon}/providers/${action.providerId}/kube/chart?namespace=${action.namespace}&source=helm&releaseName=${action.releaseName}&metaEnv=${environment.id}`,
      action.payload,
      { headers: { 'Content-Type': 'application/yaml' } });

    yield put({ type: CREATE_APPDEPLOYMENT_FULFILLED, payload: data });
    yield put(notificationActions.addNotification({ message: `${data.name} App Deployment created` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(data);
    }
  } catch (e) {
    yield put({ type: CREATE_APPDEPLOYMENT_REJECTED, payload: e.message });
  }
}

/**
 * deleteAppDeployment
 * @param {*} action - { resource, onSuccess }
 */
export function* deleteAppDeployment(action) {
  try {
    yield call(axios.delete, `${action.resource.org.properties.fqon}/appdeployments/${action.resource.id}?force=${action.force || false}`);
    yield put({ type: DELETE_APPDEPLOYMENT_FULFILLED, payload: action.resource });
    yield put(notificationActions.addNotification({ message: `${action.resource.name} App Deployment deleted` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: DELETE_APPDEPLOYMENT_REJECTED, payload: e.message });
  }
}

/**
 * deleteAppDeployments
 * @param {*} action - { resources, onSuccess }
 */
export function* deleteAppDeployments(action) {
  try {
    const all = action.resources.map(resource => axios.delete(`${resource.org.properties.fqon}/appdeployments/${resource.id}?force=${action.force || false}`));
    const names = action.resources.map(item => (item.name)).join('\n');

    yield call(axios.all, all);
    yield put({ type: DELETE_APPDEPLOYMENT_FULFILLED, payload: action.resources });
    yield put(notificationActions.addNotification({ message: `${names} app deployments deleted` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: DELETE_APPDEPLOYMENT_REJECTED, payload: e.message });
  }
}

export function* createViewWorkflow() {
  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);

    const [providers] = yield call(axios.all, [
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/providers?type=Kubernetes`),
    ]);

    yield put({
      type: INIT_APPDEPLOYMENTCREATE_FULFILLED,
      payload: {
        providers: providers.data,
      },
    });
  } catch (e) {
    yield put({ type: INIT_APPDEPLOYMENTCREATE_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: INIT_APPDEPLOYMENTCREATE_CANCELLED });
    }
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, FETCH_APPDEPLOYMENTS_REQUEST, fetchAppDeployments);
  yield fork(takeLatest, CREATE_APPDEPLOYMENT_REQUEST, createAppDeployment);
  yield fork(takeLatest, DELETE_APPDEPLOYMENT_REQUEST, deleteAppDeployment);
  yield fork(takeLatest, DELETE_APPDEPLOYMENTS_REQUEST, deleteAppDeployments);
  yield fork(takeLatest, INIT_APPDEPLOYMENTCREATE_REQUEST, createViewWorkflow);
}
