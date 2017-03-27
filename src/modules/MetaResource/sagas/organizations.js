import { takeLatest, put, call, fork } from 'redux-saga/effects';
import { push, replace } from 'react-router-redux';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * fetchAllOrgs
 */
export function* fetchAllOrgs() {
  yield put({ type: types.FETCH_ALLORGS_PENDING });

  try {
    const response = yield call(axios.get, 'orgs?expand=true');
    yield put({ type: types.FETCH_ALLORGS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_ALLORGS_REJECTED, payload: e.message });
  }
}

/**
 * fetchOrgs
 * @param {*} action - { fqon }
 */
export function* fetchOrgs(action) {
  yield put({ type: types.FETCH_ORGS_PENDING });

  try {
    const response = yield call(axios.get, `${action.fqon}/orgs?expand=true`);
    yield put({ type: types.FETCH_ORGS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_ORGS_REJECTED, payload: e.message });
  }
}

/**
 * fetchOrg
 * @param {*} action - { fqon }
 */
export function* fetchOrg(action) {
  yield put({ type: types.FETCH_ORG_PENDING });

  try {
    const response = yield call(axios.get, action.fqon);
    yield put({ type: types.FETCH_ORG_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_ORG_REJECTED, payload: e.message });
  }
}

/**
 * fetchOrgSet
 * @param {*} action - { fqon }
 */
export function* fetchOrgSet(action) {
  yield put({ type: types.FETCH_ORGSET_PENDING });

  function getOrg() {
    return axios.get(action.fqon);
  }

  function getSubOrgs() {
    return axios.get(`${action.fqon}/orgs?expand=true`);
  }

  try {
    const response = yield call(axios.all, [getOrg(), getSubOrgs()]);

    const payload = {
      organization: response[0].data,
      organizations: response[1].data,
    };

    yield put({ type: types.FETCH_ORGSET_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_ORGSET_REJECTED, payload: e.message });
  }
}

/**
 * createOrg
 * @param {*} action - { fqon, payload, routeToOrg }
 */
export function* createOrg(action) {
  yield put({ type: types.CREATE_ORG_PENDING });

  try {
    const response = yield call(axios.post, action.fqon, action.payload);
    yield put({ type: types.CREATE_ORG_FULFILLED, payload: response.data });

    if (action.routeToOrg) {
      yield put(push(`${response.data.properties.fqon}/organizations`));
    }
  } catch (e) {
    yield put({ type: types.CREATE_ORG_REJECTED, payload: e.message });
  }
}

/**
 * updateOrg
 * @param {*} action - { fqon, payload, routeToListing }
 */
export function* updateOrg(action) {
  yield put({ type: types.UPDATE_ORG_PENDING });

  try {
    const response = yield call(axios.patch, action.fqon, action.payload);
    yield put({ type: types.UPDATE_ORG_FULFILLED, payload: response.data });

    if (action.routeToListing) {
      yield put(push(`${response.data.properties.fqon}/organizations`));
    }
  } catch (e) {
    yield put({ type: types.UPDATE_ORG_REJECTED, payload: e.message });
  }
}

/**
 * deleteOrg
 * @param {*} action - { fqon, options: { route: bool, parentFQON: string } }
 */
export function* deleteOrg(action) {
  const options = action.options || {};
  yield put({ type: types.DELETE_ORG_PENDING });

  try {
    yield call(axios.delete, `${action.fqon}?force=true`);
    yield put({ type: types.DELETE_ORG_FULFILLED });

    if (options.route) {
      yield put(replace(`${options.parentFQON}/organizations`));
    }
  } catch (e) {
    yield put({ type: types.DELETE_ORG_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_ALLORGS_REQUEST, fetchAllOrgs);
  yield fork(takeLatest, types.FETCH_ORGS_REQUEST, fetchOrgs);
  yield fork(takeLatest, types.FETCH_ORG_REQUEST, fetchOrg);
  yield fork(takeLatest, types.FETCH_ORGSET_REQUEST, fetchOrgSet);
  yield fork(takeLatest, types.CREATE_ORG_REQUEST, createOrg);
  yield fork(takeLatest, types.UPDATE_ORG_REQUEST, updateOrg);
  yield fork(takeLatest, types.DELETE_ORG_REQUEST, deleteOrg);
}

