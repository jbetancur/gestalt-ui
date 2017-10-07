import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { orderBy } from 'lodash';
import * as types from '../actionTypes';

/**
 * fetchPolicies
 * @param {*} action { fqon, environmentId }
 */
export function* fetchPolicies(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}/policies?expand=true`);
    const payload = orderBy(response.data, 'name', 'asc');

    yield put({ type: types.FETCH_POLICIES_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_POLICIES_REJECTED, payload: e.message });
  }
}

/**
 * fetchPolicy
 * @param {*} action { fqon, policyId, environmentId }
 */
export function* fetchPolicy(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/policies/${action.policyId}`);

    yield put({ type: types.FETCH_POLICY_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_POLICY_REJECTED, payload: e.message });
  }
}

/**
 * createPolicy
 * @param {*} action - { fqon, environmentId, payload, onSuccess {returns response.data} }
 */
export function* createPolicy(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/environments/${action.environmentId}/policies`, action.payload);
    yield put({ type: types.CREATE_POLICY_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_POLICY_REJECTED, payload: e.message });
  }
}

/**
 * updatePolicy
 * @param {*} action - { fqon, policyId, payload, onSuccess {returns response.data}  }
 */
export function* updatePolicy(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/policies/${action.policyId}`, action.payload);
    yield put({ type: types.UPDATE_POLICY_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_POLICY_REJECTED, payload: e.message });
  }
}

/**
 * deletePolicy
 * @param {*} action - { fqon, policyId, onSuccess }
 */
export function* deletePolicy(action) {
  try {
    yield call(axios.delete, `${action.fqon}/policies/${action.policyId}?force=true`);
    yield put({ type: types.DELETE_POLICY_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_POLICY_REJECTED, payload: e.message });
  }
}

/**
 * deletePolicies
 * @param {*} action - { fqon, policyIds, onSuccess }
 */
export function* deletePolicies(action) {
  try {
    const all = action.policyIds.map(id => axios.delete(`${action.fqon}/policies/${id}?force=true`));

    yield call(axios.all, all);
    yield put({ type: types.DELETE_POLICY_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_POLICY_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_POLICIES_REQUEST, fetchPolicies);
  yield fork(takeLatest, types.FETCH_POLICY_REQUEST, fetchPolicy);
  yield fork(takeLatest, types.CREATE_POLICY_REQUEST, createPolicy);
  yield fork(takeLatest, types.UPDATE_POLICY_REQUEST, updatePolicy);
  yield fork(takeLatest, types.DELETE_POLICY_REQUEST, deletePolicy);
  yield fork(takeLatest, types.DELETE_POLICIES_REQUEST, deletePolicies);
}
