import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { orderBy } from 'lodash';
import * as types from '../actionTypes';

/**
 * fetchResourceType
 * @param {*} action { fqon, resourceTypeId }
 */
export function* fetchResourceType(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/resourcetypes/${action.resourceTypeId}`);

    yield put({ type: types.FETCH_RESOURCETYPE_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_RESOURCETYPE_REJECTED, payload: e.message });
  }
}

/**
 * fetchResourceTypes
 * @param {*} action { fqon }
 */
export function* fetchResourceTypes(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/resourcetypes?expand=true`);
    const payload = orderBy(response.data, 'created.timestamp', 'desc');

    yield put({ type: types.FETCH_RESOURCETYPES_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_RESOURCETYPES_REJECTED, payload: e.message });
  }
}

/**
 * createResourceType
 * @param {*} action - { fqon, payload, onSuccess {returns response.data} }
 */
export function* createResourceType(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/resourcetypes`, action.payload);

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }

    yield put({ type: types.CREATE_RESOURCETYPE_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.CREATE_RESOURCETYPE_REJECTED, payload: e.message });
  }
}

/**
 * deleteResourceType
 * @param {*} action - { fqon, resourceTypeId, onSuccess }
 */
export function* deleteResourceType(action) {
  try {
    yield call(axios.delete, `${action.fqon}/resourcetypes/${action.resourceTypeId}?force=true`);
    yield put({ type: types.DELETE_RESOURCETYPE_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_RESOURCETYPE_REJECTED, payload: e.message });
  }
}

/**
 * deleteResourceTypes
 * @param {*} action - { fqon, resourceTypeIds, onSuccess }
 */
export function* deleteResourceTypes(action) {
  try {
    const all = action.resourceTypeIds.map(id => axios.delete(`${action.fqon}/resourcetypes/${id}?force=true`));

    yield call(axios.all, all);
    yield put({ type: types.DELETE_RESOURCETYPE_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_RESOURCETYPE_REJECTED, payload: e.message });
  }
}


// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_RESOURCETYPE_REQUEST, fetchResourceType);
  yield fork(takeLatest, types.FETCH_RESOURCETYPES_REQUEST, fetchResourceTypes);
  yield fork(takeLatest, types.CREATE_RESOURCETYPE_REQUEST, createResourceType);
  yield fork(takeLatest, types.DELETE_RESOURCETYPE_REQUEST, deleteResourceType);
  yield fork(takeLatest, types.DELETE_RESOURCETYPES_REQUEST, deleteResourceTypes);
}
