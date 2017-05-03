import { delay } from 'redux-saga';
import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';
import { API_RETRIES } from '../../../constants';

/**
 * getSelf - handle timeouts/failures
 * @param {integer} retries
 */
export function* handleSelf(retries) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= retries; i++) {
    try {
      const response = yield call(axios.get, 'users/self');
      const orgResponse = yield call(axios.get, response.data.properties.gestalt_home);
      const payload = { ...response.data };
      payload.properties.gestalt_home = orgResponse.data;

      return payload;
    } catch (e) {
      if (i < retries) {
        yield call(delay, 2000);
      }
    }
  }

  // attempts failed
  throw new Error('Attempted to get Self Failed');
}

/**
 * fetchSelf
 */
export function* fetchSelf() {
  try {
    const payload = yield call(handleSelf, API_RETRIES);

    yield put({ type: types.FETCH_SELF_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_SELF_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_SELF_REQUEST, fetchSelf);
}
