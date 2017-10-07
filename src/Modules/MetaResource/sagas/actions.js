import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import queryString from 'query-string';
import * as types from '../actionTypes';

/**
 * fetchActions
 * @param {Object} action { fqon, entityKey, entityId, filters }
 */
export function* fetchActions(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/actions` : `${action.fqon}/actions`;
  const filterString = action.filters ? `&${queryString.stringify(action.filters)}` : '';

  try {
    const response = yield call(axios.get, `${url}?expand=true&compact=false${filterString}`);

    yield put({ type: types.FETCH_ACTIONS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_ACTIONS_REJECTED, payload: e.message });
  }
}

/**
 * fetchContextActions
 * @param {Object} action { fqon, entityKey, entityId, filters }
 */
export function* fetchContextActions(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/actions` : `${action.fqon}/actions`;
  const filterString = action.filters ? `&${queryString.stringify(action.filters)}` : '';

  try {
    const response = yield call(axios.get, `${url}?expand=true&compact=false${filterString}`);

    yield put({ type: types.FETCH_CONTEXT_ACTIONS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_CONTEXT_ACTIONS_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_ACTIONS_REQUEST, fetchActions);
  yield fork(takeLatest, types.FETCH_CONTEXT_ACTIONS_REQUEST, fetchContextActions);
}
