import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * doSearch
 * @param {Object} action - { fqon, entity, value, field }
 */
export function* doSearch(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/${action.entity}/search?${action.field || 'name'}=${action.value}`);
    yield put({ type: types.FETCH_SEARCH_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.FETCH_SEARCH_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_SEARCH_REQUEST, doSearch);
}
