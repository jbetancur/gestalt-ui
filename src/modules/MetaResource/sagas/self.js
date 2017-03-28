import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * fetchSelf
 */
export function* fetchSelf() {
  try {
    const response = yield call(axios.get, 'users/self');
    const orgResponse = yield call(axios.get, response.data.properties.gestalt_home);
    const payload = { ...response.data };
    payload.properties.gestalt_home = orgResponse.data;

    yield put({ type: types.FETCH_SELF_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_SELF_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_SELF_REQUEST, fetchSelf);
}
