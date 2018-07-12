import { takeLatest, put, call, fork, cancelled } from 'redux-saga/effects';
import axios from 'axios';
import { convertFromMaps } from 'util/helpers/transformations';
import { fetchAPI } from '../lib/utility';
import * as types from '../actionTypes';

/**
 * fetchLambdas
 * @param {*} action { fqon, environmentId }
 */
export function* fetchLambdas(action) {
  try {
    const url = action.environmentId ? `${action.fqon}/environments/${action.environmentId}/lambdas` : `${action.fqon}/lambdas`;
    const response = yield call(fetchAPI, `${url}?expand=true&embed=apiendpoints`);

    yield put({ type: types.FETCH_LAMBDAS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_LAMBDAS_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: types.FETCH_CONTAINERS_CANCELLED });
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

    yield put({ type: types.FETCH_LAMBDA_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_LAMBDA_REJECTED, payload: e.message });
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
    yield put({ type: types.CREATE_LAMBDA_FULFILLED, payload });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(payload);
    }
  } catch (e) {
    yield put({ type: types.CREATE_LAMBDA_REJECTED, payload: e.message });
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
    yield put({ type: types.UPDATE_LAMBDA_FULFILLED, payload });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(payload);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_LAMBDA_REJECTED, payload: e.message });
  }
}

/**
 * deleteLambda
 * @param {*} action - { fqon, lambdaId, onSuccess }
 */
export function* deleteLambda(action) {
  try {
    yield call(axios.delete, `${action.fqon}/lambdas/${action.lambdaId}?force=true`);
    yield put({ type: types.DELETE_LAMBDA_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_LAMBDA_REJECTED, payload: e.message });
  }
}

/**
 * deleteLambdas
 * @param {*} action - { fqon, lambdaIds, onSuccess }
 */
export function* deleteLambdas(action) {
  try {
    const all = action.lambdaIds.map(id => axios.delete(`${action.fqon}/lambdas/${id}?force=true`));

    yield call(axios.all, all);
    yield put({ type: types.DELETE_LAMBDA_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_LAMBDA_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_LAMBDAS_REQUEST, fetchLambdas);
  yield fork(takeLatest, types.FETCH_LAMBDA_REQUEST, fetchLambda);
  yield fork(takeLatest, types.CREATE_LAMBDA_REQUEST, createLambda);
  yield fork(takeLatest, types.UPDATE_LAMBDA_REQUEST, updateLambda);
  yield fork(takeLatest, types.DELETE_LAMBDA_REQUEST, deleteLambda);
  yield fork(takeLatest, types.DELETE_LAMBDAS_REQUEST, deleteLambdas);
}
