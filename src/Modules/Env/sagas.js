import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { sortBy } from 'lodash';
import {
  FETCH_ENV_REQUEST,
  FETCH_ENV_FULFILLED,
  FETCH_ENV_REJECTED,
  FETCH_ENVSCHEMA_REQUEST,
  FETCH_ENVSCHEMA_FULFILLED,
  FETCH_ENVSCHEMA_REJECTED,
} from './constants';

/**
 * fetchEnv
 * @param {*} action { fqon, entityId, entityKey }
 */
export function* fetchEnv(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/env` : `${action.fqon}/env`;
  try {
    const response = yield call(axios.get, url);

    yield put({ type: FETCH_ENV_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: FETCH_ENV_REJECTED, payload: e.message });
  }
}

/**
 * fetchEnvSchema
 * @param {*} action { schemaType, resourceTypeId }
 */
export function* fetchEnvSchema(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/resourcetypes/${action.id}/schema?filter=config`);

    const payload = {
      public: sortBy(response.data.filter(item => item.public === true), [v => v.name.toLowerCase()]),
      private: sortBy(response.data.filter(item => item.public === false), [v => v.name.toLowerCase()]),
    };

    yield put({ type: FETCH_ENVSCHEMA_FULFILLED, payload });
  } catch (e) {
    yield put({ type: FETCH_ENVSCHEMA_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, FETCH_ENV_REQUEST, fetchEnv);
  yield fork(takeLatest, FETCH_ENVSCHEMA_REQUEST, fetchEnvSchema);
}
