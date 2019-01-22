import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  FETCH_UPGRADEAVAILABLE_REQUEST,
  FETCH_UPGRADEAVAILABLE_FULFILLED,
  FETCH_UPGRADEAVAILABLE_REJECTED,
} from '../constants';

export function* fetchUpgradeAvailable() {
  try {
    const { data } = yield call(axios.get, 'upgradeavailable');

    yield put({ type: FETCH_UPGRADEAVAILABLE_FULFILLED, payload: data });
  } catch (e) {
    yield put({ type: FETCH_UPGRADEAVAILABLE_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield takeLatest(FETCH_UPGRADEAVAILABLE_REQUEST, fetchUpgradeAvailable);
}
