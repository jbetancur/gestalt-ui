import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { orderBy } from 'lodash';
import * as types from '../actionTypes';

/**
 * fetchAPIs
 * @param {*} action { fqon, environmentId }
 */
export function* fetchAPIs(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}/apis?expand=true`);
    const payload = orderBy(response.data, 'name', 'asc');

    yield put({ type: types.FETCH_APIS_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_APIS_REJECTED, payload: e.message });
  }
}

/**
 * fetchAPI
 * @param {*} action { fqon, apiId, environmentId }
 */
export function* fetchAPI(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/apis/${action.apiId}`);

    yield put({ type: types.FETCH_API_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_API_REJECTED, payload: e.message });
  }
}

/**
 * createAPI
 * @param {*} action - { fqon, environmentId, payload, onSuccess {returns response.data} }
 */
export function* createAPI(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/environments/${action.environmentId}/apis`, action.payload);
    yield put({ type: types.CREATE_API_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_API_REJECTED, payload: e.message });
  }
}

/**
 * updateAPI
 * @param {*} action - { fqon, apiId, payload, onSuccess {returns response.data}  }
 */
export function* updateAPI(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/apis/${action.apiId}`, action.payload);
    yield put({ type: types.UPDATE_API_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_API_REJECTED, payload: e.message });
  }
}

/**
 * deleteAPI
 * @param {*} action - { fqon, apiId, onSuccess }
 */
export function* deleteAPI(action) {
  try {
    yield call(axios.delete, `${action.fqon}/apis/${action.apiId}?force=true`);
    yield put({ type: types.DELETE_API_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_API_REJECTED, payload: e.message });
  }
}

/**
 * deleteAPIs
 * @param {*} action - { fqon, apiIds, onSuccess }
 */
export function* deleteAPIs(action) {
  try {
    const all = action.apiIds.map(id => axios.delete(`${action.fqon}/apis/${id}?force=true`));

    yield call(axios.all, all);
    yield put({ type: types.DELETE_API_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_API_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_APIS_REQUEST, fetchAPIs);
  yield fork(takeLatest, types.FETCH_API_REQUEST, fetchAPI);
  yield fork(takeLatest, types.CREATE_API_REQUEST, createAPI);
  yield fork(takeLatest, types.UPDATE_API_REQUEST, updateAPI);
  yield fork(takeLatest, types.DELETE_API_REQUEST, deleteAPI);
  yield fork(takeLatest, types.DELETE_APIS_REQUEST, deleteAPIs);
}
