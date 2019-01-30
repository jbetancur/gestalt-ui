import { takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_GROUPMEMBER_REQUEST,
  ADD_GROUPMEMBER_FULFILLED,
  ADD_GROUPMEMBER_REJECTED,
  REMOVE_GROUPMEMBER_REQUEST,
  REMOVE_GROUPMEMBER_FULFILLED,
  REMOVE_GROUPMEMBER_REJECTED,
} from '../actionTypes';

/**
 * addGroupMember
 * @param {*} action - { fqon, groupId, userId, onSuccess {returns response.data} }
 */
export function* addGroupMember(action) {
  try {
    yield call(axios.patch, `${action.fqon}/groups/${action.groupId}/users?id=${action.userId}`, []);
    const response = yield call(axios.get, `${action.fqon}/groups/${action.groupId}?expand=true`);
    yield put({ type: ADD_GROUPMEMBER_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: ADD_GROUPMEMBER_REJECTED, payload: e.message });
  }
}

/**
 * removeGroupMember
 * @param {*} action - { fqon, groupId, userId, onSuccess {returns response.data} }
 */
export function* removeGroupMember(action) {
  try {
    yield call(axios.delete, `${action.fqon}/groups/${action.groupId}/users?id=${action.userId}`, []);
    const response = yield call(axios.get, `${action.fqon}/groups/${action.groupId}?expand=true`);
    yield put({ type: REMOVE_GROUPMEMBER_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: REMOVE_GROUPMEMBER_REJECTED, payload: e.message });
  }
}


// Watchers
export default function* () {
  yield takeLatest(ADD_GROUPMEMBER_REQUEST, addGroupMember);
  yield takeLatest(REMOVE_GROUPMEMBER_REQUEST, removeGroupMember);
}
