import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import {
  FETCH_ALLORGS_REQUEST,
  FETCH_ALLORGS_FULFILLED,
  FETCH_ALLORGS_REJECTED,
  FETCH_ALLORGSDROPDOWN_REQUEST,
  FETCH_ALLORGSDROPDOWN_FULFILLED,
  FETCH_ALLORGSDROPDOWN_REJECTED,
} from '../constants';

/**
 * fetchAllOrgs
 */
export function* fetchAllOrgs() {
  try {
    const response = yield call(axios.get, 'orgs?expand=true');
    yield put({ type: FETCH_ALLORGS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: FETCH_ALLORGS_REJECTED, payload: e.message });
  }
}

/**
 * fetchAllOrgsDropDown
 * @param {*} action - { fqon }
 */
export function* fetchAllOrgsDropDown(action) {
  function getOrg() {
    return axios.get(action.fqon);
  }

  function getSubOrgs() {
    return axios.get(`${action.fqon}/orgs?expand=true`);
  }

  try {
    const response = yield call(axios.all, [getOrg(), getSubOrgs()]);

    const payload = response[1].data.map(item => ({ name: item.name, value: item.properties.fqon }));
    payload.unshift({ name: response[0].data.name, value: response[0].data.properties.fqon });

    yield put({ type: FETCH_ALLORGSDROPDOWN_FULFILLED, payload });
  } catch (e) {
    yield put({ type: FETCH_ALLORGSDROPDOWN_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, FETCH_ALLORGS_REQUEST, fetchAllOrgs);
  yield fork(takeLatest, FETCH_ALLORGSDROPDOWN_REQUEST, fetchAllOrgsDropDown);
}
