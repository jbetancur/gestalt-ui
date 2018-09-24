import { takeLatest, put, call, fork, cancelled } from 'redux-saga/effects';
import axios from 'axios';
import { convertFromMaps } from 'util/helpers/transformations';
import { notificationActions } from 'Modules/Notifications';
import { fetchAPI } from 'config/lib/utility';
import {
  FETCH_LAMBDAS_REQUEST,
  FETCH_LAMBDAS_FULFILLED,
  FETCH_LAMBDAS_REJECTED,
  FETCH_LAMBDAS_CANCELLED,
  FETCH_LAMBDA_REQUEST,
  FETCH_LAMBDA_FULFILLED,
  FETCH_LAMBDA_REJECTED,
  CREATE_LAMBDA_REQUEST,
  CREATE_LAMBDA_FULFILLED,
  CREATE_LAMBDA_REJECTED,
  UPDATE_LAMBDA_REQUEST,
  UPDATE_LAMBDA_FULFILLED,
  UPDATE_LAMBDA_REJECTED,
  DELETE_LAMBDAS_REQUEST,
  DELETE_LAMBDA_REQUEST,
  DELETE_LAMBDA_FULFILLED,
  DELETE_LAMBDA_REJECTED,
} from '../constants';

/**
 * fetchLambdas
 * @param {*} action { fqon, environmentId }
 */
export function* fetchLambdas(action) {
  try {
    const url = action.environmentId ? `${action.fqon}/environments/${action.environmentId}/lambdas` : `${action.fqon}/lambdas`;
    const response = yield call(fetchAPI, `${url}?expand=true&embed=apiendpoints`);

    yield put({ type: FETCH_LAMBDAS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: FETCH_LAMBDAS_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: FETCH_LAMBDAS_CANCELLED });
    }
  }
}

/**
 * fetchLambda
 * @param {*} action { fqon, lambdaId }
 */
export function* fetchLambda(action) {
  try {
    const lambdaResponse = yield call(axios.get, `${action.fqon}/lambdas/${action.lambdaId}`);
    const envResponse = yield call(axios.get, `${lambdaResponse.data.properties.parent.href}/env`);
    const payload = { ...lambdaResponse.data };

    payload.properties.env = convertFromMaps(lambdaResponse.data.properties.env, envResponse.data);

    yield put({ type: FETCH_LAMBDA_FULFILLED, payload });
  } catch (e) {
    yield put({ type: FETCH_LAMBDA_REJECTED, payload: e.message });
  }
}

/**
 * createLambda
 * @param {*} action - { fqon, environmentId, payload, onSuccess {returns response.data} }
 */
export function* createLambda(action) {
  try {
    const lambdaResponse = yield call(axios.post, `${action.fqon}/environments/${action.environmentId}/lambdas`, action.payload);
    // On a new resource we still need to pull in the inheritied envs so we can reconcile them
    const envResponse = yield call(axios.get, `${lambdaResponse.data.properties.parent.href}/env`);
    const payload = { ...lambdaResponse.data };

    payload.properties.env = convertFromMaps(lambdaResponse.data.properties.env, envResponse.data);
    yield put({ type: CREATE_LAMBDA_FULFILLED, payload });
    yield put(notificationActions.addNotification({ message: `${payload.name} Lambda created` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(payload);
    }
  } catch (e) {
    yield put({ type: CREATE_LAMBDA_REJECTED, payload: e.message });
  }
}

/**
 * updateLambda
 * @param {*} action - { fqon, lambdaId, payload, onSuccess {returns response.data}  }
 */
export function* updateLambda(action) {
  try {
    const lambdaResponse = yield call(axios.patch, `${action.fqon}/lambdas/${action.lambdaId}`, action.payload);
    // On a patch resource we still need to pull in the inheritied envs so we can reconcile them
    const envResponse = yield call(axios.get, `${lambdaResponse.data.properties.parent.href}/env`);
    const payload = { ...lambdaResponse.data };

    payload.properties.env = convertFromMaps(lambdaResponse.data.properties.env, envResponse.data);
    yield put({ type: UPDATE_LAMBDA_FULFILLED, payload });
    yield put(notificationActions.addNotification({ message: `${payload.name} Lambda updated` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(payload);
    }
  } catch (e) {
    yield put({ type: UPDATE_LAMBDA_REJECTED, payload: e.message });
  }
}

/**
 * deleteLambda
 * @param {*} action - { fqon, lambdaId, onSuccess }
 */
export function* deleteLambda(action) {
  try {
    yield call(axios.delete, `${action.fqon}/lambdas/${action.resource.id}?force=${action.force || false}`);
    yield put({ type: DELETE_LAMBDA_FULFILLED });
    yield put(notificationActions.addNotification({ message: `${action.resource.name} Lambda deleted` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: DELETE_LAMBDA_REJECTED, payload: e.message });
  }
}

/**
 * deleteLambdas
 * @param {*} action - { fqon, lambdaIds, onSuccess }
 */
export function* deleteLambdas(action) {
  try {
    const all = action.resources.map(resource => axios.delete(`${action.fqon}/lambdas/${resource.id}?force=${action.force || false}`));
    const names = action.resources.map(item => (item.name)).join('\n');

    yield call(axios.all, all);
    yield put({ type: DELETE_LAMBDA_FULFILLED });
    yield put(notificationActions.addNotification({ message: `${names} lambdas deleted` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: DELETE_LAMBDA_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, FETCH_LAMBDAS_REQUEST, fetchLambdas);
  yield fork(takeLatest, FETCH_LAMBDA_REQUEST, fetchLambda);
  yield fork(takeLatest, CREATE_LAMBDA_REQUEST, createLambda);
  yield fork(takeLatest, UPDATE_LAMBDA_REQUEST, updateLambda);
  yield fork(takeLatest, DELETE_LAMBDA_REQUEST, deleteLambda);
  yield fork(takeLatest, DELETE_LAMBDAS_REQUEST, deleteLambdas);
}