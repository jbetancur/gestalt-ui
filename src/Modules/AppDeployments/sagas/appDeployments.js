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
} from '../constants';
import { FETCH_CONTEXT_FULFILLED } from '../../Hierarchy/constants';

/**
 * fetchAppDeployments
 * @param {*} action { fqon, parentId }
 */
export function* fetchAppDeployments(action) {
  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);

    const { data } = yield call(fetchAPI, `${action.fqon}/environments/${environment.id}/appdeployments?expand=true`);

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
 * @param {*} action - { fqon, parentId, payload, onSuccess {returns response.data} }
 */
export function* createAppDeployment(action) {
  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);

    const { data } = yield call(axios.post, `${action.fqon}/environments/${environment.id}/appdeployments`, action.payload);
    // On a new resource we still need to pull in the inheritied envs so we can reconcile them

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
 * @param {*} action - { fqon, resource, onSuccess }
 */
export function* deleteAppDeployment(action) {
  try {
    yield call(axios.delete, `${action.fqon}/appdeployments/${action.resource.id}?force=${action.force || false}`);
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
 * @param {*} action - { fqon, lambdaIds, onSuccess }
 */
export function* deleteAppDeployments(action) {
  try {
    const all = action.resources.map(resource => axios.delete(`${action.fqon}/appdeployments/${resource.id}?force=${action.force || false}`));
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

// Watchers
export default function* () {
  yield fork(takeLatest, FETCH_APPDEPLOYMENTS_REQUEST, fetchAppDeployments);
  yield fork(takeLatest, CREATE_APPDEPLOYMENT_REQUEST, createAppDeployment);
  yield fork(takeLatest, DELETE_APPDEPLOYMENT_REQUEST, deleteAppDeployment);
  yield fork(takeLatest, DELETE_APPDEPLOYMENTS_REQUEST, deleteAppDeployments);
}
