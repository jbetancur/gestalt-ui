import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { orderBy } from 'lodash';
import * as types from '../actionTypes';

/**
 * fetchPolicyRules
 * @param {*} action { fqon, policyId }
 */
export function* fetchPolicyRules(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/policies/${action.policyId}/rules?expand=true`);
    const payload = orderBy(response.data, 'name', 'asc');

    yield put({ type: types.FETCH_POLICYRULES_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_POLICYRULES_REJECTED, payload: e.message });
  }
}

/**
 * fetchPolicyRule
 * @param {*} action { fqon, policyId, ruleId }
 */
export function* fetchPolicyRule(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/policies/${action.policyId}/rules/${action.ruleId}`);

    yield put({ type: types.FETCH_POLICYRULE_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_POLICYRULE_REJECTED, payload: e.message });
  }
}

/**
 * createPolicyRule
 * @param {*} action - { fqon, policyId, payload, onSuccess {returns response.data} }
 */
export function* createPolicyRule(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/policies/${action.policyId}/rules`, action.payload);
    yield put({ type: types.CREATE_POLICYRULE_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_POLICYRULE_REJECTED, payload: e.message });
  }
}

/**
 * updatePolicyRule
 * @param {*} action - { fqon, policyId, ruleId, payload, onSuccess {returns response.data}  }
 */
export function* updatePolicyRule(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/policies/${action.policyId}/rules/${action.ruleId}`, action.payload);
    yield put({ type: types.UPDATE_POLICYRULE_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_POLICYRULE_REJECTED, payload: e.message });
  }
}

/**
 * deletePolicyRule
 * @param {*} action - { fqon, policyId, ruleId, onSuccess }
 */
export function* deletePolicyRule(action) {
  try {
    yield call(axios.delete, `${action.fqon}/policies/${action.policyId}/rules/${action.ruleId}?force=true`);
    yield put({ type: types.DELETE_POLICYRULE_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_POLICYRULE_REJECTED, payload: e.message });
  }
}

/**
 * deletePolicyRules
 * @param {*} action - { fqon, policyId, ruleIds, onSuccess }
 */
export function* deletePolicyRules(action) {
  try {
    const all = action.ruleIds.map(id => axios.delete(`${action.fqon}/policies/${action.policyId}/rules/${id}?force=true`));

    yield call(axios.all, all);
    yield put({ type: types.DELETE_POLICYRULE_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_POLICYRULE_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_POLICYRULES_REQUEST, fetchPolicyRules);
  yield fork(takeLatest, types.FETCH_POLICYRULE_REQUEST, fetchPolicyRule);
  yield fork(takeLatest, types.CREATE_POLICYRULE_REQUEST, createPolicyRule);
  yield fork(takeLatest, types.UPDATE_POLICYRULE_REQUEST, updatePolicyRule);
  yield fork(takeLatest, types.DELETE_POLICYRULE_REQUEST, deletePolicyRule);
  yield fork(takeLatest, types.DELETE_POLICYRULES_REQUEST, deletePolicyRules);
}
