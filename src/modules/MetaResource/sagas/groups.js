import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { orderBy } from 'lodash';
import * as types from '../actionTypes';

/**
 * fetchGroups
 * @param {*} action { fqon }
 */
export function* fetchGroups(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/groups?expand=true`);
    const payload = orderBy(response.data, 'name', 'asc');

    yield put({ type: types.FETCH_GROUPS_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_GROUPS_REJECTED, payload: e.message });
  }
}

/**
 * fetchGroup
 * @param {*} action { fqon, groupId }
 */
export function* fetchGroup(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/groups/${action.groupId}`);

    yield put({ type: types.FETCH_GROUP_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_GROUP_REJECTED, payload: e.message });
  }
}

/**
 * createGroup
 * @param {*} action - { fqon, payload, onSuccess {returns response.data} }
 */
export function* createGroup(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/groups`, action.payload);
    yield put({ type: types.CREATE_GROUP_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_GROUP_REJECTED, payload: e.message });
  }
}

/**
 * updateGroup
 * @param {*} action - { fqon, groupId, payload, onSuccess {returns response.data}  }
 */
export function* updateGroup(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/groups/${action.groupId}`, action.payload);
    yield put({ type: types.UPDATE_GROUP_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_GROUP_REJECTED, payload: e.message });
  }
}

/**
 * deleteGroup
 * @param {*} action - { fqon, groupId, onSuccess }
 */
export function* deleteGroup(action) {
  try {
    yield call(axios.delete, `${action.fqon}/groups/${action.groupId}?force=true`);
    yield put({ type: types.DELETE_GROUP_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_GROUP_REJECTED, payload: e.message });
  }
}

/**
 * deleteGroups
 * @param {*} action - { fqon, groupIds, onSuccess }
 */
export function* deleteGroups(action) {
  try {
    const all = action.groupIds.map(id => axios.delete(`${action.fqon}/groups/${id}?force=true`));

    yield call(axios.all, all);
    yield put({ type: types.DELETE_GROUP_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_GROUP_REJECTED, payload: e.message });
  }
}

/**
 * addGroupMember
 * @param {*} action - { fqon, groupId, userId, onSuccess {returns response.data} }
 */
export function* addGroupMember(action) {
  try {
    yield call(axios.patch, `${action.fqon}/groups/${action.groupId}/users?id=${action.userId}`, []);
    const response = yield call(axios.get, `${action.fqon}/groups/${action.groupId}?expand=true`);
    yield put({ type: types.ADD_GROUP_MEMBER_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.ADD_GROUP_MEMBER_REJECTED, payload: e.message });
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
    yield put({ type: types.REMOVE_GROUP_MEMBER_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.REMOVE_GROUP_MEMBER_REJECTED, payload: e.message });
  }
}


// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_GROUPS_REQUEST, fetchGroups);
  yield fork(takeLatest, types.FETCH_GROUP_REQUEST, fetchGroup);
  yield fork(takeLatest, types.CREATE_GROUP_REQUEST, createGroup);
  yield fork(takeLatest, types.UPDATE_GROUP_REQUEST, updateGroup);
  yield fork(takeLatest, types.DELETE_GROUP_REQUEST, deleteGroup);
  yield fork(takeLatest, types.DELETE_GROUPS_REQUEST, deleteGroups);
  yield fork(takeLatest, types.ADD_GROUP_MEMBER_REQUEST, addGroupMember);
  yield fork(takeLatest, types.REMOVE_GROUP_MEMBER_REQUEST, removeGroupMember);
}
