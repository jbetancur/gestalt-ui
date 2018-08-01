import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { sortBy } from 'lodash';
import * as types from '../actionTypes';

/**
 * fetchEnv
 * @param {*} action { fqon, entityId, entityKey }
 */
export function* fetchEnv(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/env` : `${action.fqon}/env`;
  try {
    const response = yield call(axios.get, url);

    yield put({ type: types.FETCH_ENV_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.FETCH_ENV_REJECTED, payload: e.message });
  }
}

/**
 * fetchEnvSchema
 * @param {*} action { schemaType, resourceTypeId }
 */
export function* fetchEnvSchema(action) {
  try {
    const response = yield call(axios.get, `root/resourcetypes/${action.resourceTypeId}/schema?filter=config`);

    const payload = {
      public: sortBy(response.data.filter(item => item.public === true), [v => v.name.toLowerCase()]),
      private: sortBy(response.data.filter(item => item.public === false), [v => v.name.toLowerCase()]),
    };

    yield put({ type: types.FETCH_ENV_SCHEMA_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_ENV_SCHEMA_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_ENV_REQUEST, fetchEnv);
  yield fork(takeLatest, types.FETCH_ENV_SCHEMA_REQUEST, fetchEnvSchema);
}
