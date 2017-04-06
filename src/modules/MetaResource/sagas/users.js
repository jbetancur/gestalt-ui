import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * fetchUsers
 * @param {*} action { fqon }
 */
export function* fetchUsers(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/users?expand=true`);

    yield put({ type: types.FETCH_USERS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_USERS_REJECTED, payload: e.message });
  }
}

/**
 * fetchUser
 * @param {*} action { fqon, userId }
 */
export function* fetchUser(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/users/${action.userId}`);

    yield put({ type: types.FETCH_USER_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_USER_REJECTED, payload: e.message });
  }
}

/**
 * createUser
 * @param {*} action - { fqon, payload, onSuccess {returns response.data} }
 */
export function* createUser(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/users`, action.payload);
    yield put({ type: types.CREATE_USER_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_USER_REJECTED, payload: e.message });
  }
}

/**
 * updateUser
 * @param {*} action - { fqon, userId, payload, onSuccess {returns response.data}  }
 */
export function* updateUser(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/users/${action.userId}`, action.payload);
    yield put({ type: types.UPDATE_USER_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_USER_REJECTED, payload: e.message });
  }
}

/**
 * deleteUser
 * @param {*} action - { fqon, userId, onSuccess }
 */
export function* deleteUser(action) {
  try {
    yield call(axios.delete, `${action.fqon}/users/${action.userId}?force=true`);
    yield put({ type: types.DELETE_USER_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_USER_REJECTED, payload: e.message });
  }
}

/**
 * deleteUsers
 * @param {*} action - { fqon, userIds, onSuccess }
 */
export function* deleteUsers(action) {
  try {
    const all = action.userIds.map(id => axios.delete(`${action.fqon}/users/${id}?force=true`));

    yield call(axios.all, all);
    yield put({ type: types.DELETE_USER_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_USER_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_USERS_REQUEST, fetchUsers);
  yield fork(takeLatest, types.FETCH_USER_REQUEST, fetchUser);
  yield fork(takeLatest, types.CREATE_USER_REQUEST, createUser);
  yield fork(takeLatest, types.UPDATE_USER_REQUEST, updateUser);
  yield fork(takeLatest, types.DELETE_USER_REQUEST, deleteUser);
  yield fork(takeLatest, types.DELETE_USERS_REQUEST, deleteUsers);
}
