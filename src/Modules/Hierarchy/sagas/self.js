import { takeLatest, put, call, retry } from 'redux-saga/effects';
import axios from 'axios';
import { userProfileActionTypes as userProfileTypes } from 'Modules/UserProfile';
import {
  FETCH_SELF_REQUEST,
  FETCH_SELF_FULFILLED,
  FETCH_SELF_REJECTED,
} from '../actionTypes';
import { API_RETRIES } from '../../../constants';

/**
 * getSelf - handle timeouts/failures
 * @param {integer} retries
 */
export function* handleSelf() {
  const response = yield call(axios.get, 'users/self');
  const orgResponse = yield call(axios.get, response.data.properties.gestalt_home);
  const payload = { ...response.data };
  payload.properties.gestalt_home = orgResponse.data;

  return payload;
}

/**
 * fetchSelf
 */
export function* fetchSelf() {
  try {
    const payload = yield retry(API_RETRIES, 2000, handleSelf);
    // load users/self into state
    yield put({ type: FETCH_SELF_FULFILLED, payload });
    // load user profiles into state
    yield put({ type: userProfileTypes.FETCH_USERPROFILE_REQUEST });
  } catch (e) {
    yield put({ type: FETCH_SELF_REJECTED, payload: e.message });
    throw new Error('Attempts to reach meta/self failed');
  }
}

// Watchers
export default function* () {
  yield takeLatest(FETCH_SELF_REQUEST, fetchSelf);
}
