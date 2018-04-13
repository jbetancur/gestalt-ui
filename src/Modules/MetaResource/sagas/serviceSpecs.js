import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { orderBy } from 'lodash';
import * as types from '../actionTypes';

/**
 * fetchServiceSpecs
 * @param {*} action { fqon }
 */
export function* fetchServiceSpecs(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/servicespecs?expand=true`);
    const payload = orderBy(response.data, 'name', 'asc');

    yield put({ type: types.FETCH_SERVICESPECS_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_SERVICESPECS_REJECTED, payload: e.message });
  }
}

/**
 * createServiceSpec
 * @param {*} action - { fqon, payload, onSuccess {returns response.data} }
 */
export function* createServiceSpec(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/servicespecs`, action.payload);
    yield put({ type: types.CREATE_SERVICESPEC_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_SERVICESPEC_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_SERVICESPECS_REQUEST, fetchServiceSpecs);
  yield fork(takeLatest, types.CREATE_SERVICESPEC_REQUEST, createServiceSpec);
}
