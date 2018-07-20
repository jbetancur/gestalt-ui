import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
// import { buildParams } from '../lib/urlmapper';
import * as types from '../actionTypes';

/**
 * searchUser
 * @param {Object} action - { fqon, entity, value, field }
 */
export function* searchUser(action) {
  try {
    const { data } = yield call(axios.get, `root/${action.entity}/search?${action.field || 'name'}=${action.value}`);
    yield put({ type: types.DO_SEARCHUSERS_FULFILLED, payload: data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(data);
    }
  } catch (e) {
    yield put({ type: types.DO_SEARCHUSERS_REJECTED, payload: e.message });
  }
}

export function* searchAsset(action) {
  try {
    const { data } = yield call(axios.get, `${action.entity}/search?name=${action.value}`);

    yield put({ type: types.DO_SEARCHASSETS_FULFILLED, payload: data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(data);
    }
  } catch (e) {
    yield put({ type: types.DO_SEARCHASSETS_REJECTED, payload: e.message });
  }
}


// Watchers
export default function* () {
  yield fork(takeLatest, types.DO_SEARCHUSERS_REQUEST, searchUser);
  yield fork(takeLatest, types.DO_SEARCHASSETS_REQUEST, searchAsset);
}
